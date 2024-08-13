# ldla-server-uploader-cloudinary

## Description

`ldla-server-uploader-cloudinary` est un composant npm qui permet de mettre en place un serveur Express pour gérer l'upload, la récupération et la suppression d'images via l'API Cloudinary. Ce package est conçu pour être facilement intégré dans un projet Node.js.

## Installation

Pour installer le package, exécutez la commande suivante :

```bash

- npm install ldla-server-uploader-cloudinary

Utilisation

Prérequis

- Node.js (version 12 ou supérieure)

- Un compte Cloudinary pour gérer les images

Configuration

- Créez un fichier .env à la racine de votre projet pour stocker vos clés API Cloudinary :

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name

CLOUDINARY_API_KEY=your-cloudinary-api-key

CLOUDINARY_API_SECRET=your-cloudinary-api-secret

PORT=3001

- Remplacez your-cloudinary-cloud-name, your-cloudinary-api-key, et your-cloudinary-api-secret par vos informations Cloudinary.

Implémentation

Dans votre fichier principal (par exemple, index.js), importez et utilisez le package :

require('dotenv').config();
const myImageServer = require('my-image-server');
myImageServer.start();

Options de configuration

Vous pouvez également personnaliser le serveur en passant un objet de configuration :

const config = {
  port: process.env.PORT || 3001,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  corsOptions: {
    origin: '*',
  }
};

myImageServer.start(config);

Routes API disponibles

1. Upload d'images: POST /upload

Description : Cette route permet de télécharger jusqu'à 11 images simultanément sur Cloudinary.

Body de la requête : multipart/form-data avec le champ images contenant les fichiers d'image.

Réponse:

{
  "message": "Upload successful",
  "results": [
    {
      "public_id": "image_id",
      "original_filename": "original_name.jpg",
      "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1618312789/sample.jpg"
    }
  ]
}

2. Récupérer les images: GET /images

Description : Cette route récupère jusqu'à 150 images stockées sur votre compte Cloudinary.

Réponse :

[
  {
    "public_id": "image_id",
    "url": "https://res.cloudinary.com/your-cloud-name/image/upload/v1618312789/sample.jpg"
  }
]

3. Supprimer une image: DELETE /images/

Description : Cette route permet de supprimer une image spécifique de Cloudinary en utilisant son publicId.

Réponse :

{
  "message": "Image with public ID image_id deleted successfully."
}

Gestion des erreurs
Le serveur renverra un code d'état HTTP 500 et un message d'erreur JSON en cas de problème, comme une erreur d'upload ou de suppression d'image.

Contribution
Les contributions sont les bienvenues ! Si vous souhaitez ajouter des fonctionnalités, corriger des bugs, ou améliorer la documentation, n'hésitez pas à soumettre une pull request.

License
Ce projet est sous licence MIT. Consultez le fichier LICENSE pour plus de détails.










