const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const axios = require('axios');

dotenv.config();

function start(customConfig = {}) {
    const app = express();
    const port = customConfig.port || process.env.PORT || 3001;

    cloudinary.config({
        cloud_name: customConfig.cloudinary?.cloud_name || process.env.CLOUDINARY_CLOUD_NAME,
        api_key: customConfig.cloudinary?.api_key || process.env.CLOUDINARY_API_KEY,
        api_secret: customConfig.cloudinary?.api_secret || process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });

    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage });

    app.use(cors(customConfig.corsOptions || {}));
    app.use(express.json());

    app.post('/upload', upload.array('images', 11), async (req, res) => {
        try {
            const uploadPromises = req.files.map(file => {
                return new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    });
                    uploadStream.end(file.buffer);
                });
            });

            const uploadResults = await Promise.all(uploadPromises);
            res.json({ message: 'Upload successful', results: uploadResults });
        } catch (error) {
            res.status(500).json({ message: 'Error uploading images', error });
        }
    });

    app.get('/images', async (req, res) => {
        const cloudinaryUrl = `https://${cloudinary.config().api_key}:${cloudinary.config().api_secret}@api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/resources/image`;

        try {
            const response = await axios.get(cloudinaryUrl, {
                auth: {
                    username: cloudinary.config().api_key,
                    password: cloudinary.config().api_secret,
                },
                params: {
                    max_results: 150,
                },
            });

            const assets = response.data.resources;
            res.json(assets);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch images' });
        }
    });

    app.delete('/images/:publicId', async (req, res) => {
        const { publicId } = req.params;

        try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result !== 'ok') {
                return res.status(500).json({ message: 'Failed to delete image from Cloudinary' });
            }
            res.json({ message: `Image with public ID ${publicId} deleted successfully.` });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting image', error });
        }
    });

    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

module.exports = { start };