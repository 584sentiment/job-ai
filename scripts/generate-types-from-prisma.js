#!/usr/bin/env node
/**
 * 从 Prisma Schema 生成共享类型定义
 *
 * 用法: node scripts/generate-types-from-prisma.js
 */

const fs = require('fs')
const path = require('path')

// 读取 Prisma schema
const schemaPath = path.join(__dirname, '../backend/prisma/schema.prisma')
const schema = fs.readFileSync(schemaPath, 'utf-8')

// 简单的 Prisma schema 解析器
function parsePrismaSchema(schema) {
  const models = []
  const modelRegex = /model\s+(\w+)\s*{([^}]+)}/g
  let match

  while ((match = modelRegex.exec(schema)) !== null) {
    const modelName = match[1]
    const fields = match[2]

    // 解析字段
    const fieldDefs = fields.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'))

    const fieldsMap = {}
    fieldDefs.forEach(fieldDef => {
      const parts = fieldDef.split(/\s+/)
      const fieldName = parts[0]
      const fieldType = parts[1]

      if (fieldName && fieldType) {
        // 处理字段类型
        let tsType = fieldType
        if (fieldType === 'String') tsType = 'string'
        else if (fieldType === 'Int') tsType = 'number'
        else if (fieldType === 'BigInt') tsType = 'number'
        else if (fieldType === 'Boolean') tsType = 'boolean'
        else if (fieldType === 'Json') tsType = 'any'
        else if (fieldType === 'DateTime') tsType = 'Date'
        else if (fieldType.endsWith('[]')) {
          const baseType = fieldType.replace('[]', '')
          let baseTsType = baseType
          if (baseType === 'String') baseTsType = 'string'
          else if (baseType === 'Int') baseTsType = 'number'
          tsType = `${baseTsType}[]`
        }

        // 检查是否可选
        const isOptional = fieldDef.includes('?')
        const isNullable = parts.includes('')

        fieldsMap[fieldName] = {
          type: tsType,
          optional: isOptional || fieldDef.includes('@default')
        }
      }
    })

    models.push({
      name: modelName,
      fields: fieldsMap
    })
  }

  return models
}

// 生成 TypeScript 类型
function generateTypes(models) {
  let output = '/**\n * 从 Prisma schema 自动生成的类型定义\n * 请勿手动编辑,使用 `npm run generate:types` 重新生成\n */\n\n'

  models.forEach(model => {
    output += `/**\n * ${model.name} 实体\n */\n`
    output += `export interface ${model.name} {\n`

    Object.entries(model.fields).forEach(([fieldName, fieldInfo]) => {
      const optional = fieldInfo.optional ? '?' : ''
      output += `  ${fieldName}${optional}: ${fieldInfo.type}\n`
    })

    output += `}\n\n`
  })

  return output
}

// 执行生成
const models = parsePrismaSchema(schema)
const types = generateTypes(models)

// 写入文件
const outputPath = path.join(__dirname, '../packages/shared/src/types/generated.ts')
fs.writeFileSync(outputPath, types, 'utf-8')

console.log('✅ 类型定义已生成到:', outputPath)
