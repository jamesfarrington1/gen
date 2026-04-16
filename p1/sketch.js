



let canvas;
let particles = [];
let pendingParticles = [];
let maxParticles = 80;
let currentParticle = null;
let food = null;
let lastFoodSpawn = 0;
let foodLifetime = 5000;
let foodCooldown = 3000;


let scores = {
    attractor: 0,
    repeller: 0,
    wanderer: 0,
    blackHole: 0,
    teleporter: 0,
    multiply: 0,
    anchor: 0,
    special: 0
};

let particleRadius = 15;
let particleDiameter = particleRadius * 2;

let attractorImg, repellerImg, wandererImg, blackHoleImg, teleporterImg, multiplyImg, anchorImg, specialImg, toolbarImg, foodImg, trashImg;

const transformTypes = ["attractor", "repeller", "wanderer", "teleporter", "multiply", "anchor"];
const blackHoleChance = 0.01;

function preload() {
    attractorImg = loadImage('img/attractor.png');
    repellerImg = loadImage('img/repeller.png');
    wandererImg = loadImage('img/wanderer.png');
    blackHoleImg = loadImage('img/blackHole.png');
    teleporterImg = loadImage('img/teleporter.png');
    multiplyImg = loadImage('img/multiply.png');
    anchorImg = loadImage('img/anchor.png');
    specialImg = loadImage('img/special.png');
    toolbarImg = loadImage('img/toolbar.png');
    foodImg = loadImage('img/food.png');
    trashImg = loadImage('img/trash.png');
}

let rectWidth = 0;


function setup() {
    
    let mainEl = document.querySelector("main");
    canvas = createCanvas(mainEl.clientWidth, mainEl.clientHeight);
    canvas.parent(mainEl);

    rectWidth = width/15;
    spawnFood();
  }
  
  function draw() {
    background(255);
    imageMode(CENTER);
    pendingParticles = [];
    
    //TOOLBAR RECT
  //  noStroke();
 //   fill('#dedede');
  //  rect (width-rectWidth, 0, rectWidth, height);
    image(toolbarImg, width-rectWidth/2, height/2, rectWidth-10, height-10);


    //FOOD SYSTEM
    if (!food && millis() - lastFoodSpawn > foodCooldown) {
        spawnFood();
    }

    if (food) {
        if (millis() - food.spawnedAt > foodLifetime) {
            food = null;
            lastFoodSpawn = millis();

        } else {
            image(foodImg, food.x, food.y, particleDiameter/3, particleDiameter/3);
        }


        
    }
  


    //PARTICLES IN THE TOOLBAR

            //attractor
            //stroke(220,90,90);
           // strokeWeight(4);
            //fill(255, 150, 150);
            //circle (width-rectWidth/2, 40, particleDiameter);
            image(attractorImg, width-rectWidth/2, 40, particleDiameter, particleDiameter);


            
                fill(80);
                noStroke();
                textAlign(CENTER, TOP);
                textSize(10);
                text("Attractor: " + scores.attractor, width - rectWidth / 2, 40 + particleDiameter / 2 + 6);
            

            //repeller
            //stroke(100,140,220);
            //fill(150, 200, 255);
           // circle(width-rectWidth/2, 100, particleDiameter);

           if (scores.attractor >= 2) {
            image(repellerImg, width-rectWidth/2, 100, particleDiameter, particleDiameter);

            fill(80);
            noStroke();
            textAlign(CENTER, TOP);
            textSize(10);
            text("Repeller: " + scores.repeller, width - rectWidth / 2, 100 + particleDiameter / 2 + 6);

           }

            //wanderer
           // stroke(204, 163, 17);
           // fill(242, 214, 65);
           // circle(width-rectWidth/2, 160, particleDiameter);


           if (scores.attractor >= 2 && scores.repeller >= 2) {
            image(wandererImg, width-rectWidth/2, 160, particleDiameter, particleDiameter);

                fill(80);
            noStroke();
            textAlign(CENTER, TOP);
            textSize(10);
            text("Wanderer: " + scores.wanderer, width - rectWidth / 2, 160 + particleDiameter / 2 + 6);
           }

            //blackHole
            //stroke(32);
            //fill(100);
            //circle(width-rectWidth/2, 220, particleDiameter);

            if (scores.attractor >= 2 && scores.repeller >= 2 && scores.wanderer >= 1) {
            image(blackHoleImg, width-rectWidth/2, 220, particleDiameter, particleDiameter);

                fill(80);
            noStroke();
            textAlign(CENTER, TOP);
            textSize(10);
            text("Black Hole: " + scores.blackHole, width - rectWidth / 2, 220 + particleDiameter / 2 + 6);
            }




               //teleporter




            if (scores.attractor >= 3 && scores.repeller >= 2 && scores.wanderer >= 2) {
         
            image(teleporterImg, width-rectWidth/2, 280, particleDiameter, particleDiameter);

            fill(80);
            noStroke();
            textAlign(CENTER, TOP);
            textSize(10);
            text("Teleporter: " + scores.teleporter, width - rectWidth / 2, 280 + particleDiameter / 2 + 6);
            }


            //multiply

            if (scores.attractor >= 3 && scores.repeller >=3 && scores.wanderer >= 2 && scores.teleporter >= 1) {
            //multiply
            image(multiplyImg, width-rectWidth/2, 340, particleDiameter, particleDiameter);

            fill(80);
            noStroke();
            textAlign(CENTER, TOP);
            textSize(10);
            text("Multiplier: " + scores.multiply, width - rectWidth / 2, 340 + particleDiameter / 2 + 6);
            }

            //anchor

            if (scores.multiply >= 1) {
            image(anchorImg, width-rectWidth/2, 400, particleDiameter, particleDiameter);

            fill(80);
            noStroke();
            textAlign(CENTER, TOP);
            textSize(10);
            text("Anchor: " + scores.anchor, width - rectWidth / 2, 400 + particleDiameter / 2 + 6);
            }

            //special

            if (scores.multiply >= 4) {
            image(specialImg, width-rectWidth/2, 460, particleDiameter, particleDiameter);

            fill(80);
            noStroke();
            textAlign(CENTER, TOP);
            textSize(10);
            text("Special: " + scores.special, width - rectWidth / 2, 460 + particleDiameter / 2 + 6);
            }


            image(trashImg, width-rectWidth/2, height-50, particleDiameter*2, particleDiameter*2);
           // fill(80);
            //noStroke();
           // textAlign(CENTER, TOP);
           // textSize(10);
           // text(("Clear Playground"), width - rectWidth / 2, height - 40);



//MOUSE HOVER
    if (currentParticle === "attractor") {
        tint(255, 50);
        image(attractorImg, mouseX, mouseY, particleDiameter, particleDiameter);
        noTint();
    } else if (currentParticle === "repeller") {
        tint(255, 50);
        image(repellerImg, mouseX, mouseY, particleDiameter, particleDiameter);
        noTint();
    } else if (currentParticle === "wanderer") {
        tint(255, 50);
        image(wandererImg, mouseX, mouseY, particleDiameter, particleDiameter);
        noTint();
    } else if (currentParticle === "blackHole") {
        tint(255, 50);
        image(blackHoleImg, mouseX, mouseY, particleDiameter, particleDiameter);
        noTint();
    } else if (currentParticle === "teleporter") {
        tint(255, 50);
        image(teleporterImg, mouseX, mouseY, particleDiameter, particleDiameter);
        noTint();
    } else if (currentParticle === "multiply") {
        tint(255, 50);
        image(multiplyImg, mouseX, mouseY, particleDiameter, particleDiameter);
        noTint();
    } else if (currentParticle === "anchor") {
        tint(255, 50);
        image(anchorImg, mouseX, mouseY, particleDiameter*2, particleDiameter*2);
        noTint();
    } else if (currentParticle === "special") {
        tint(255, 50);
        image(specialImg, mouseX, mouseY, particleDiameter, particleDiameter);
        noTint();
    }


    //PARTICLES
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
            let pScale = p.scale || 1;
            let pRadius = particleRadius * pScale;
            if (p.type === "anchor" || (p.type === "attractor" && p.isGiant)) {
            pRadius = particleRadius * 2 * pScale;
            
    }

    //food attraction
    if (food) {
        let foodD = dist(p.x, p.y, food.x, food.y);

        if (foodD < 1800 && foodD > 0) {
            let foodStrength = 1 - (foodD /1800);
            p.vx += ((food.x - p.x) / foodD) * foodStrength;
            p.vy += ((food.y - p.y) / foodD) * foodStrength;
        }

        if (foodD < pRadius + particleDiameter/6) {
            food = null;
            lastFoodSpawn = millis();
            scores[p.type] += 1;
           // p.type = "special";
        }

        

    }

    //MERGING?
    if (p.type === "attractor" && !p.isGiant) {
        let nearby = [];
        for (let j = i + 1; j < particles.length; j++) {
            let other = particles[j];

            if (other.type === "attractor" && !other.isGiant) {
                let d = dist(p.x, p.y, other.x, other.y);
                if (d < particleDiameter * 1.5) {
                    nearby.push(j);
                }
            }

            if (nearby.length === 2) {
                break;
            }
        }

            if (nearby.length === 2) {
                let a = particles[nearby[0]];
                let b = particles[nearby[1]];

                p.x = (p.x + a.x + b.x) / 3;
                p.y = (p.y + a.y + b.y) / 3;

                p.vx = (p.vx + a.vx + b.vx) / 3;
                p.vy = (p.vy + a.vy + b.vy) / 3;

                p.isGiant = true;

                particles.splice(nearby[1], 1);
                particles.splice(nearby[0], 1);

            }
    }




    //PARTICLE INTERACTIONS
    for (let j = 0; j < particles.length; j++) {
        let other = particles[j];
             let otherRadius = particleRadius * pScale;
             if (other.type === "anchor") {
             otherRadius = particleRadius * 2 * pScale;

             }
        if (i === j) {
            continue;
        }

        //DISTANCE
        let d = dist(p.x, p.y, other.x, other.y);
        let strength = 1 - (d / 100);
        let strengthRepulsion = (1 - (d / 100)) * 1.5;

        //ATTRACTION AND REPULSION
            if (d < 100 && d > pRadius + otherRadius) {
                if (p.type === "attractor") {
                    if (other.x > p.x) {
                        p.vx += strength*3.5;
                    } else if (other.x < p.x) {
                        p.vx -= strength*3.5;
                    }

                    if (other.y > p.y) {
                        p.vy += strength*3.5;
                    } else if (other.y < p.y) {
                        p.vy -= strength*3.5;
                    }
                }
            }
            if (d < 100 && d < pRadius + otherRadius) {
               // if (p.type === "attractor") {
                    if (other.x > p.x) {
                        p.vx -= strength*3.5;
                    } else if (other.x < p.x) {
                        p.vx += strength*3.5;
                    }

                    if (other.y > p.y) {
                        p.vy -= strength*3.5;
                    } else if (other.y < p.y) {
                        p.vy += strength*3.5;
                    }
               // }
            }

            //REPELLERS
            if (d < 100 && d > pRadius + otherRadius) {
                if (p.type === "repeller") {
                    if (other.x > p.x) {
                        p.vx -= strengthRepulsion;
                    } else if (other.x < p.x) {
                        p.vx += strengthRepulsion;
                    }

                    if (other.y > p.y) {
                        p.vy -= strengthRepulsion;
                    } else if (other.y < p.y) {
                        p.vy += strengthRepulsion;
                    }
                }
            }

        //BLACK HOLE
        if (d < 50 && p.type === "blackHole" && other.type !== "blackHole") {
            if (other.x > p.x) {
                other.vx -= strength * 2;
            } else if (other.x < p.x) {
                other.vx += strength * 2;
            }

            if (other.y > p.y) {
                other.vy -= strength * 2;
            } else if (other.y < p.y) {
                other.vy += strength * 2;
            }
        }
        
        if (d < pRadius + otherRadius && p.type === "blackHole" && other.type !== "blackHole") {
            particles.splice(j, 1);
            j--;
            continue;
        }



        //MULTIPLY
        if (d < pRadius + otherRadius && p.type === "multiply" && millis() - p.lastMultiply > 12000 && particles.length + pendingParticles.length < maxParticles) {
            pendingParticles.push({
                x: p.x + random(-20, 20),
                y: p.y + random(-20, 20),
                vx: random(-2, 2),
                vy: random(-2, 2),
                type: other.type,
                lastTeleport: 0,
                lastMultiply: 0,
                isGiant: false,
                scale: pScale/3
            });
            p.lastMultiply = millis();
        }


        //SPECIALLLL JOB
        if (d < pRadius + otherRadius && p.type === "special") {
           if (random() < blackHoleChance) {
            other.type = "blackHole";
        } else {
            other.type = random(transformTypes);
        }
        }

        
    }

    //DELETE BAD PARTICLES
    if (p.x > width-rectWidth+20 || p.x < -20 || p.y < -20 || p.y > height+20) {
        particles.splice(i, 1);
        continue;
    }

    

    //SPEED CAP
    p.vx = constrain(p.vx, -3, 3);
    p.vy = constrain(p.vy, -3, 3);

    //wanderer movement
    if (p.type === "wanderer") {
        p.vx += random(-0.5, 0.5);
        p.vy += random(-0.5, 0.5);
       // rotate(random(-0.005, 0.0));
    }


    //blackHole movement
    if (p.type === "blackHole") {
        p.vx = random(-0.25, 0.25);
        p.vy = random(-0.25, 0.25);
    }

    //TELEPORTER
    if (p.type === "teleporter") {
        if (millis() - p.lastTeleport > 3000) {
            p.x = random(particleRadius, width - rectWidth - particleRadius);
            p.y = random(particleRadius, height - particleRadius);

        p.lastTeleport = millis();
        }
    
    }

    //anchor movement
    if (p.type === "anchor") {
        p.vx = random(-0.25, 0.25);
        p.vy = random(-0.25, 0.25);
    }

    //special movement
    if (p.type === "special") {
        p.vx += random(-0.5, 0.5);
    }


        //movement
        p.x += p.vx;
        p.y += p.vy;

        //boundaries
        if (p.x < pRadius || p.x > width-(rectWidth)-pRadius) {
            p.vx *= -1;
        }
        if (p.y < pRadius || p.y > height-pRadius) {
            p.vy *= -1;
        }


        //draw the particle!!
        strokeWeight(4);
        if (p.type === "attractor" && !p.isGiant) {
            //stroke(220,90,90);
            //fill(255, 150, 150);
            //circle(p.x, p.y, particleDiameter);
            image(attractorImg, p.x, p.y, particleDiameter * pScale, particleDiameter * pScale);
        } else if (p.type === "attractor" && p.isGiant) {
            image(attractorImg, p.x, p.y, particleDiameter*2 * pScale, particleDiameter*2 * pScale);
        
         }else if (p.type === "repeller") {
            image(repellerImg, p.x, p.y, particleDiameter * pScale, particleDiameter * pScale);
        } else if (p.type === "wanderer") {
            image(wandererImg, p.x, p.y , particleDiameter * pScale, particleDiameter * pScale);
        } else if (p.type === "blackHole") {
            let progress = (frameCount * 0.02) % 1;

            let maxSize = particleDiameter + 60;
            let minSize = particleDiameter;

            let auraSize = maxSize - progress * (maxSize - minSize);

            noFill();
            stroke(0, 0, 0, 20);
            strokeWeight(2);
            circle(p.x, p.y, auraSize);

            let progress2 = ((frameCount * 0.03) + .8) % 1;

            let auraSize2 = maxSize - progress2 * (maxSize - minSize);

            stroke(0, 0, 0, 20);
            circle(p.x, p.y, auraSize2);


            image(blackHoleImg, p.x, p.y, particleDiameter, particleDiameter);
        } else if (p.type === "teleporter") {
            image(teleporterImg, p.x, p.y, particleDiameter * pScale, particleDiameter * pScale);
        } else if (p.type === "multiply") {
            image(multiplyImg, p.x, p.y, particleDiameter * pScale, particleDiameter * pScale);
        } else if (p.type === "anchor") {
            image(anchorImg, p.x, p.y, particleDiameter*2 * pScale, particleDiameter*2 * pScale);
        } else if (p.type === "special") {
            image(specialImg, p.x, p.y, particleDiameter * pScale, particleDiameter * pScale);
        }
        
    


        //draw the food
       //    image(foodImg, food.x, food.y, particleDiameter/3, particleDiameter/3);

       
    }



 //Like last thing idk
 particles.push(...pendingParticles);



  }
  
  function windowResized() {
    let mainEl = document.querySelector("main");
    resizeCanvas(mainEl.clientWidth, mainEl.clientHeight);;
    rectWidth = width / 15;
}

function mousePressed() {
    let d = dist(mouseX, mouseY, width-rectWidth/2, 40);
    let d2 = dist(mouseX, mouseY, width-rectWidth/2, 100);
    let d3 = dist(mouseX, mouseY, width-rectWidth/2, 160);
    let d4 = dist(mouseX, mouseY, width-rectWidth/2, 220);
    let d5 = dist(mouseX, mouseY, width-rectWidth/2, 280);
    let d6 = dist(mouseX, mouseY, width-rectWidth/2, 340);
    let d7 = dist(mouseX, mouseY, width-rectWidth/2, 400);
    let d8 = dist(mouseX, mouseY, width-rectWidth/2, 460);

    let d9 = dist(mouseX, mouseY, width-rectWidth/2, height-50);

    
//attractor
    if (d < particleRadius) {
        //alert("You clicked the red circle!");
        currentParticle = "attractor";
        return;
    }

//repeller
if (d2 < particleRadius) {
    currentParticle = "repeller";
    return;
}

//wanderer
if (d3 < particleRadius) {
    currentParticle = "wanderer";
    return;
}

//blackHole
if (d4 < particleRadius) {
    currentParticle = "blackHole";
    return;
}

//teleporter
if (d5 < particleRadius) {
    currentParticle = "teleporter";
    return;
}

//multiply
if (d6 < particleRadius) {
    currentParticle = "multiply";
    return;
}

//anchor
if (d7 < particleRadius) {
    currentParticle = "anchor";
    return;
}

//special
if (d8 < particleRadius) {
    currentParticle = "special";
    return;
}





if (d9 < particleRadius*2) {
        particles = [];
       // currentParticle = null;
        return;
        
    }



//clicking the toolbar
    if (mouseX > width-rectWidth) {
        currentParticle = null;
        return;
    }

    if (currentParticle !== null) {
        placeParticle();
    }

    


    //shcokwave

    if (currentParticle === null) {
    for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let d = dist(mouseX, mouseY, p.x, p.y);

    if (d < 350 && d > 0) {
        p.vx += 3*(p.x - mouseX) / d * 5;
        p.vy += 3*(p.y - mouseY) / d * 5;
    }
}
}
    
    
  }

function keyPressed() {
    if (key === '1') {
        currentParticle = "attractor";
    } else if (key === '2') {
        currentParticle = "repeller";
    } else if (key === '3') {
        currentParticle = "wanderer";
    } else if (key === '4') {
        currentParticle = "blackHole";
    } else if (key === '5') {
        currentParticle = "teleporter";
    } else if (key === '6') {
        currentParticle = "multiply";
    } else if (key === '7') {
        currentParticle = "anchor";
    } else if (key === '8') {
        currentParticle = "special";
    }
}

  function placeParticle() {
    particles.push({
        x: mouseX,
        y: mouseY,
        vx: random(-2, 2),
        vy: random(-2, 2),
        type: currentParticle,
        lastTeleport: 0,
        lastMultiply: 0,
        isGiant: false,
        scale: 1
      });
  }

  function spawnFood() {
    food = {
        x: random(particleRadius, width - rectWidth - particleRadius),
        y: random(particleRadius, height - particleRadius),
        spawnedAt: millis()
    };
}