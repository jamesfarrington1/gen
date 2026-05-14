import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlYBlTNZEPGK0miEIuWeNLVREWIMB9ia8",
  authDomain: "current-address-fa4d0.firebaseapp.com",
  projectId: "current-address-fa4d0",
  storageBucket: "current-address-fa4d0.firebasestorage.app",
  messagingSenderId: "87716306783",
  appId: "1:87716306783:web:e4ec83bdd9738ac9d320ea",
  measurementId: "G-Q4RTF9WGS9"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function testFirebase() {
  await addDoc(collection(db, "postcards"), {
    message: "firebase is working",
    createdAt: Date.now()
  });

  console.log("SAVED TO FIREBASE");
}

//testFirebase();















  let cardX;
  let cardY;
let cardW = 1000;
let cardH = 600;

let postcardImage;
let postcardImageUrl = "";
let postcardTitle = "";
let currentPostcardId = null;

let flipped = false;
let doodleLayer;
let drawing = false;

let fadeLevel = 180;

let cardRotation = 0;
let targetRotation = 0;

let flipButton;
let sendButton;



function setup() {
  createCanvas(windowWidth, windowHeight);
  let addButton = createButton("");
    addButton.html("<img src='img/addButton.png' width='120' height='120'>");
    addButton.addClass("add-button");

  addButton.mousePressed(getRandomImage);

  cardX = width / 2 - cardW / 2;
  cardY = height / 2 - cardH / 2;

  addButton.position(cardX + 99, cardY - 116);

  doodleLayer = createGraphics(cardW, cardH);
  doodleLayer.background(255);

  flipButton = createButton("");
  flipButton.html("<img src='img/flipArrow.png' width='120' height='120'>");
  flipButton.addClass("flip-button");
    
    flipButton.mousePressed(() => {
        if (targetRotation === 0) {
            targetRotation = 180;
            } else {
            targetRotation = 0;
            }
        } );

        flipButton.position(cardX - 40, cardY + cardH / 1.4- 30);

    sendButton = createButton("");
    sendButton.html("<img src='img/sendButton.png' width='300' height='120*1.02'>");
    sendButton.addClass("send-button");

    sendButton.mousePressed(sendPostcard);
    
    sendButton.position(cardX + cardW - 180, cardY + cardH / 1.4- 30);

    let receiveButton = createButton("");
    receiveButton.html("<img src='img/receiveButton.png' width='240' height='120'>");
    receiveButton.addClass("receive-button");

    receiveButton.mousePressed(receivePostcard);
    receiveButton.position(cardX + cardW - 320, cardY - 106);




        addButton.parent("toolbar");
        flipButton.parent("toolbar");
        sendButton.parent("toolbar");
        receiveButton.parent("toolbar");
}

async function getRandomImage() {
    const response = await fetch(
        "https://commons.wikimedia.org/w/api.php?action=query&generator=random&grnnamespace=6&prop=imageinfo&iiprop=url&format=json&origin=*"
    )

    

     const data = await response.json();

     const page = Object.values(data.query.pages)[0];

     postcardTitle = page.title;

     postcardImageUrl = page.imageinfo[0].url;

     loadImage(postcardImageUrl, img => {
        postcardImage = img;
        currentPostcardId = null;
        cardRotation = 0;

        doodleLayer.background(255);
        flipped = false;
        targetRotation = 0;
     });

    }

function draw() {

  //background(220);
  clear();

  fill(0);

  textSize(20);

  //text(postcardTitle, 40, 100);

 // if (postcardImage) {

  // image(postcardImage, cardX, cardY, cardW, cardH);

 // }

 if (postcardImage) {
    flipButton.show();
    } else {
    flipButton.hide();
 }

 if (postcardImage) {
    sendButton.show();
    } else {
    sendButton.hide();
 }


  cardRotation = lerp(cardRotation, targetRotation, 0.12);

  if (cardRotation > 90) {
    flipped = true;
  } else {
    flipped = false;
  }

  let squeeze = abs(cos(radians(cardRotation)));


push();
translate(cardX + cardW / 2, cardY + cardH / 2);
scale(squeeze, 1);



        if (flipped && postcardImage) {
            rectMode (CENTER);

            fill(255);
            stroke(0);
            strokeWeight(4);
            rect(0, 0, cardW, cardH);

            imageMode(CORNER);
            image(doodleLayer, -cardW / 2, -cardH / 2, cardW, cardH);

            noFill();
            stroke(0);
            strokeWeight(4);
            rect(0, 0, cardW, cardH);

            rectMode (CORNER);
           


            fill(0);
            noStroke();
            textSize(10);
            text("Leave your mark. Or don't.", -cardW / 2 + 20, -cardH / 2 + 30);

            
        } else {
            
            if (postcardImage) {

                    //white border

                    rectMode (CENTER);

                    stroke(0);
                    strokeWeight(4);

                    fill(255);
                    rect (0, 0, cardW, cardH);

                    rectMode (CORNER);



                    //IMAGEEEEE



                    let imageWidth = cardW/1.05;
                    let imageHeight = cardH/1.08;
                    let imageX = -imageWidth / 2;
                    let imageY = -imageHeight / 2;

                imageMode (CENTER);
                
                image(postcardImage, 0, 0, cardW/1.05, cardH/1.08);
                    noFill();
                    stroke(0);
                    strokeWeight(1);

                    rectMode (CENTER);
                    rect(0, 0, cardW/1.05, cardH/1.08);

                    rectMode (CORNER);



                    //Text Boxxxxx
                    fill(0);
                
                textSize(10);
                textWidth(postcardTitle);
                let titleWidth = textWidth(postcardTitle);

                if (titleWidth > imageWidth - 20) {
                    textSize(8);
                }

                noStroke();
                rect(imageX, imageY + imageHeight - 20, titleWidth + 10, 20);

                
                fill(255);

                text(postcardTitle, imageX + 5, imageY + imageHeight - 5);
                }
            
                

                
        }


        pop();
}






function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}


function mouseDragged() {
    if (flipped && mouseX >= cardX && mouseX <= cardX + cardW && mouseY >= cardY && mouseY <= cardY + cardH) {
        doodleLayer.stroke(0);
        doodleLayer.strokeWeight(2);
        doodleLayer.line(pmouseX - cardX, pmouseY - cardY, mouseX - cardX, mouseY - cardY);
    }

}

async function sendPostcard() {
    if (currentPostcardId) {
        setDoc(doc(db, "postcards", currentPostcardId), {
            imageTitle: postcardTitle,
            imageUrl: postcardImageUrl,
            doodle: doodleLayer.canvas.toDataURL(),
            createdAt: Date.now()
        });

    } else {
    addDoc(collection(db, "postcards"), {
    imageTitle: postcardTitle,
    imageUrl: postcardImageUrl,
    doodle: doodleLayer.canvas.toDataURL(),
    createdAt: Date.now()
    });

    };

    postcardImage = null;
    postcardImageUrl = "";
    postcardTitle = "";
    doodleLayer.background(255);
    flipped = false;
    cardRotation = 0;
    targetRotation = 0;

}

async function receivePostcard() {
                const snapshot = await getDocs(collection(db, "postcards"));
                const postcards = snapshot.docs.map(docSnap => {
            return {
                id: docSnap.id,
                ...docSnap.data()
            };
            });
            if (postcards.length === 0) {
            return;
            }
            const pickedPostcard = random(postcards);
            currentPostcardId = pickedPostcard.id;
            postcardTitle = pickedPostcard.imageTitle;
            postcardImageUrl = pickedPostcard.imageUrl;
            loadImage(postcardImageUrl, img => {
            postcardImage = img;
            });
            doodleLayer.background(255);

            if (pickedPostcard.doodle) {
            loadImage(pickedPostcard.doodle, img => {
                doodleLayer.push();
                doodleLayer.tint(255, fadeLevel);

                doodleLayer.image(img, 0, 0, cardW, cardH);

                doodleLayer.pop();
            });
            }
}
    



window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;

window.mouseDragged = mouseDragged;
//window.mousePressed = mousePressed;
//window.mouseReleased = mouseReleased;