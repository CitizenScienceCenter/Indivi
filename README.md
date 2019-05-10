# Indivi
A React client side application for generating reports for participants in clinical trials, created by the [UZH Center for Gerontology](https://www.zfg.uzh.ch/en.html)

---

Run/build Indivi

1) In order to build or run the project:
- run in the command line "npm install" from the folder with the project

2a) To run the webApp in development mode:
- run in the command line "npm start"
- open http://localhost:3000/ to see the webApp  

2b) To build the project:
- run in the command line "npm run build" instead of "npm start"

Production build: The npm run build is used to create a production build that can be put on a web server (e.g., via uploading to FTP).

---

Python configuration

If you receive an error from node-gyp about python incompatibility such as

gyp ERR! configure error 
gyp ERR! stack Error: Python executable "/Users/chat/anaconda3/bin/python" is v3.6.5, which is not supported by gyp.
gyp ERR! stack You can pass the --python switch to point to Python >= v2.5.0 & < 3.0.0.


use the following command before running npm install:

 npm config set python /usr/bin/python

---

The Indvi project aims at delivering personalized feedback to participants of psychological studies in an understandable, visual and ethical way. 

The details on the user research, the requirements, the architecture and the specificaitons of this application can be found in the Wiki attached to this repository.

The Indivi project is a collaboration between the URPP "Healthy Aging", the Insitute of Psychology and the ZPAC Lab of the University of Zurich.

This project was developped as a Master thesis.

Created by:   
Florian Fischer   
