// pages/edit-profile/edit-profile.js
const DataManager = require('../../utils/data-manager.js');

Page({
  data: {
    userProfile: {},
    bioLength: 0
  },

  onLoad() {
    this.loadUserProfile();
  },

  /**
   * 加载用户信息
   */
  loadUserProfile() {
    const userProfile = DataManager.getUserProfile() || {
      avatarUrl: '',
      nickName: '',
      bio: '',
      phone: ''
    };

    this.setData({
      userProfile: userProfile,
      bioLength: (userProfile.bio || '').length
    });
  },

  /**
   * 选择头像
   */
  onChooseAvatar() {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;

        // 更新头像显示
        that.setData({
          'userProfile.avatarUrl': tempFilePath
        });

        wx.showToast({
          title: '头像已选择',
          icon: 'success',
          duration: 1000
        });
      },
      fail(err) {
        console.error('选择头像失败:', err);
      }
    });
  },

  /**
   * 昵称输入
   */
  onNicknameInput(e) {
    this.setData({
      'userProfile.nickName': e.detail.value
    });
  },

  /**
   * 简介输入
   */
  onBioInput(e) {
    this.setData({
      'userProfile.bio': e.detail.value,
      bioLength: e.detail.value.length
    });
  },

  /**
   * 手机号输入
   */
  onPhoneInput(e) {
    this.setData({
      'userProfile.phone': e.detail.value
    });
  },

  /**
   * 提交表单
   */
  onSubmit(e) {
    const formData = e.detail.value;
    const { userProfile } = this.data;

    // 表单验证
    if (!formData.nickname || formData.nickname.trim() === '') {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    // 手机号格式验证（如果填写了）
    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      });
      return;
    }

    // 构建用户信息
    const updatedProfile = {
      avatarUrl: userProfile.avatarUrl || '',
      nickName: formData.nickname.trim(),
      bio: formData.bio.trim(),
      phone: formData.phone.trim(),
      updateTime: new Date().toISOString()
    };

    // 保存到 DataManager
    DataManager.updateUserProfile(updatedProfile);

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  /**
   * 取消
   */
  onCancel() {
    wx.navigateBack();
  }
});
