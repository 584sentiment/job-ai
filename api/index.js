// Vercel serverless function entry point
// Handles ESM import for the backend app

module.exports = async (req, res) => {
    try {
        // Dynamic import is required for ES Modules
        const { default: app } = await import('../backend/dist/api/index.js');

        // Pass the request and response to the Express app
        app(req, res);
    } catch (error) {
        console.error('Failed to import backend app:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
