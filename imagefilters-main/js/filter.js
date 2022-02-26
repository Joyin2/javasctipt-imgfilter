//removing all filters
function nofilter() {
    cxt. clearRect(0, 0, CVS.width, CVS.height);
    cxt.drawImage(image, 0, 0)
    imgdata = cxt.getImageData(0, 0, image.width, image.height)
    data = imgdata.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i];
        data[i + 1] = data[i + 1];
        data[i + 2] = data[i + 2];
    }
    cxt.putImageData(imgdata, 0, 0)
}

//black and white
function blackWhite() {
    data = imgdata.data
    
    for (let i = 0; i < data.length/4; i++){
        let gray = data[i * 4] * 0.3 + data[i * 4 + 1] * 0.59 + data[i * 4 + 2] * 0.11;
        let black = gray > 128 ? 255 : 0;

        data[i * 4] = black
        data[i * 4 + 1] = black
        data[i * 4 + 2] = black
    }

    cxt.putImageData(imgdata, 0, 0)
}

    //sharpen
function sharpen(w, h, mix) {
    var x, sx, sy, r, g, b, a, dstOff, srcOff, wt, cx, cy, scy, scx,
        weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
        katet = Math.round(Math.sqrt(weights.length)),
        half = (katet * 0.5) | 0,
        dstData = cxt.createImageData(w, h),
        dstBuff = dstData.data,
        srcBuff = cxt.getImageData(0, 0, w, h).data,
        y = h;

    while (y--) {
        x = w;
        while (x--) {
            sy = y;
            sx = x;
            dstOff = (y * w + x) * 4;
            r = 0;
            g = 0;
            b = 0;
            a = 0;

            for (cy = 0; cy < katet; cy++) {
                for (cx = 0; cx < katet; cx++) {
                    scy = sy + cy - half;
                    scx = sx + cx - half;

                    if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                        srcOff = (scy * w + scx) * 4;
                        wt = weights[cy * katet + cx];

                        r += srcBuff[srcOff] * wt;
                        g += srcBuff[srcOff + 1] * wt;
                        b += srcBuff[srcOff + 2] * wt;
                        a += srcBuff[srcOff + 3] * wt;
                    }
                }
            }

            dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
            dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
            dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
            dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
        }
    }
    cxt.putImageData(dstData, 0, 0);
}

function soften() {
    cxt.globalAlpha = 0.5; // Higher alpha made it more smooth
    // Add blur layers by strength to x and y
    // 2 made it a bit faster without noticeable quality loss
    let strength = 1.25;
    for (let y = -strength; y <= strength; y += 2) {
        for (let x = -strength; x <= strength; x += 2) {
            // Apply layers
            cxt.drawImage(image, x, y);
            // Add an extra layer, prevents it from rendering lines
            // on top of the images (does makes it slower though)
            if (x>=0 && y>=0) {
                cxt.drawImage(image, -(x-1), -(y-1));
            }
        }
    }
    cxt.globalAlpha = 1.0;
}


function faded(){
    cxt.globalCompositeOperation = 'source-over';
    cxt.fillStyle = "rgba(255, 255, 255, 0.17)";
    cxt.beginPath();
    cxt.fillRect(0, 0, CVS.width, CVS.height);
    cxt.fill();
    cxt.globalCompositeOperation = 'source-over';
}

function vignette(){
    var gradient,
        outerRadius = Math.sqrt( Math.pow( CVS.width/2, 2 ) + Math.pow( CVS.height/2, 2 ) );

    // Adds outer darkened blur effect
    cxt.globalCompositeOperation = 'source-over';
    gradient = cxt.createRadialGradient( CVS.width/2, CVS.height/2, 0, CVS.width/2, CVS.height/2, outerRadius );
    gradient.addColorStop( 0, 'rgba(0, 0, 0, 0)' );
    gradient.addColorStop( 0.8, 'rgba(0, 0, 0, 0)' );
    gradient.addColorStop( 1, 'rgba(0, 0, 0, 0.6)' );
    cxt.fillStyle = gradient;
    cxt.fillRect( 0, 0, CVS.width, CVS.height );

    // Adds central lighten effect
    cxt.globalCompositeOperation = 'lighter';
    gradient = cxt.createRadialGradient( CVS.width/2, CVS.height/2, 0, CVS.width/2, CVS.height/2, outerRadius );
    gradient.addColorStop( 0, 'rgba(255, 255, 255, 0.1)' );
    gradient.addColorStop( 0.65, 'rgba(255, 255, 255, 0)' );
    gradient.addColorStop( 1, 'rgba(0, 0, 0, 0)' );
    cxt.fillStyle = gradient;
    cxt.fillRect( 0, 0, CVS.width, CVS.height );

}


//filterfunctions
function flterColors(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}

let filters = new Array();
filters.push(new flterColors(0xFF, 0xFF, 0xFF));
filters.push(new flterColors(0xEB, 0xB1, 0x13));
filters.push(new flterColors(0x00, 0xB5, 0xFF));

//grayscale 
function grayscale() {
    let data = imgdata.data;
    for(let i = 0; i < data.length; i += 4){
        
        let luma = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        
        let rIntensity = (filters[0].r * 50 + 255 * (100 - 50)) / 25500;
        let gIntensity = (filters[0].g * 50 + 255 * (100 - 50)) / 25500;
        let bIntensity = (filters[0].b * 50 + 255 * (100 - 50)) / 25500;

        data[i] = Math.round(rIntensity * luma);
        data[i+1] = Math.round(gIntensity * luma);
        data[i+2] = Math.round(bIntensity * luma);
    }
    cxt.putImageData(imgdata, 0, 0);
}

function warm() {
    let data = imgdata.data;
    for(let i = 0; i < data.length; i += 4){
        
        let luma = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        
        let rIntensity = (filters[1].r * 50 + 255 * (100 - 50)) / 25500;
        let gIntensity = (filters[1].g * 50 + 255 * (100 - 50)) / 25500;
        let bIntensity = (filters[1].b * 50 + 255 * (100 - 50)) / 25500;

        data[i] = Math.round(rIntensity * luma);
        data[i+1] = Math.round(gIntensity * luma);
        data[i+2] = Math.round(bIntensity * luma);
    }
    
    cxt.putImageData(imgdata, 0, 0);
}

function cool(){
    let data = imgdata.data;
    for(let i = 0; i < data.length; i += 4){
        
        let luma = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        
        let rIntensity = (filters[2].r * 50 + 255 * (100 - 50)) / 25500;
        let gIntensity = (filters[2].g * 50 + 255 * (100 - 50)) / 25500;
        let bIntensity = (filters[2].b * 50 + 255 * (100 - 50)) / 25500;

        data[i] = Math.round(rIntensity * luma);
        data[i+1] = Math.round(gIntensity * luma);
        data[i+2] = Math.round(bIntensity * luma);
    }
    
    cxt.putImageData(imgdata, 0, 0);
}


// classic



function classic(){
  cxt.globalCompositeOperation = 'source-over';
  cxt.fillStyle = "rgba(255, 51, 0, 0.07)";
  cxt.beginPath();
  cxt.fillRect(0, 0, CVS.width, CVS.height);
  cxt.fill();
  cxt.globalCompositeOperation = 'source-over';
}


// cartoon

function cartoon(w, h, mix) {
  var x, sx, sy, r, g, b, a, dstOff, srcOff, wt, cx, cy, scy, scx,
      weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
      katet = Math.round(Math.sqrt(weights.length)),
      half = (katet * 0.5) | 0,
      dstData = cxt.createImageData(w, h),
      dstBuff = dstData.data,
      srcBuff = cxt.getImageData(0, 0, w, h).data,
      y = h;

  while (y--) {
      x = w;
      while (x--) {
          sy = y;
          sx = x;
          dstOff = (y * w + x) * 4;
          r = 0;
          g = 0;
          b = 0;
          a = 0;

          for (cy = 0; cy < katet; cy++) {
              for (cx = 0; cx < katet; cx++) {
                  scy = sy + cy - half;
                  scx = sx + cx - half;

                  if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                      srcOff = (scy * w + scx) * 4;
                      wt = weights[cy * katet + cx];

                      r += srcBuff[srcOff] * wt;
                      g += srcBuff[srcOff + 1] * wt;
                      b += srcBuff[srcOff + 2] * wt;
                      a += srcBuff[srcOff + 3] * wt;
                  }
              }
          }

          dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
          dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
          dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
          dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
      }
  }
  cxt.putImageData(dstData, 0, 0);

}



// frost


function frost(){
    cxt.globalCompositeOperation = 'source-over';
    cxt.fillStyle = "rgba(252, 233, 255, 0.2)";
    cxt.beginPath();
    cxt.fillRect(0, 0, CVS.width, CVS.height);
    cxt.fill();
    cxt.globalCompositeOperation = 'source-over';
  }
  








