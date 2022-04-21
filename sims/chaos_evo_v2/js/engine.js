const AXES_X = 15;
const AXES_Y = 15;

const AXES_WIDTH  = 400;
const AXES_HEIGHT = 400;

const PIXEL_SIZE  = Math.PI / 200;

function rnd256() {
    return 50 + Math.floor( 206 * Math.random() );
};

function randomColor() {
    return 'rgb(' + rnd256() + ',' + rnd256() + ',' + rnd256() + ')';
};


function findTrue(array, checker) {
    for(element of array) {
        if ( checker(array) ) {
            return true;
        }
    }

    return null;
};

class Slider {
    constructor (x = 0, y = 0, r = 5, max = 195) {
        this.x = x;
        this.y = y;

        this.r = r;
    }

    drawIt() {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.x,  this.y,  this.r, 0, 2 * Math.PI);
        ctx.fill();
    }

    isOverIt(event) {
        if( (event.offsetX - this.x)**2 + (event.offsetY - this.y)**2 <= this.r**2 ) {
            return true;
        } else {
            return false;
        }
    }

    isOverPath(event) {
        if( (event.offsetX - this.x)**2 <= this.r**2 &&
           event.offsetY > AXES_Y && event.offsetY < AXES_Y + AXES_HEIGHT) {
            return true;
        } else {
            return false;
        }
    }

    moveTo(x, y) {
        if ( x < AXES_X + this.r) {
            this.x = AXES_X + this.r;
        } else if ( x > AXES_X + AXES_WIDTH - this.r) {
            this.x = AXES_X + AXES_WIDTH - this.r;
        } else {
            this.x = x;
        }

        if ( y < AXES_Y + this.r) {
            this.y = AXES_Y + this.r;
        } else if ( y > AXES_Y + AXES_HEIGHT - this.r) {
            this.y = AXES_Y + AXES_HEIGHT - this.r;
        } else {
            this.y = y;
        }
    }
}


class FourierSeries {
    constructor(length = 5) {
        this.length = length - 1;

        this.a0 = 0;
        
        this.a = [];
        this.b = [];

        for(let i = 0; i < length; ++i) {
            this.a.push(0);
            this.b.push(0);
        }


        this.color = randomColor();
    }

    eval(x) {
        let summ = this.a0;

        for(let i = 0; i < this.length; ++i) {
            summ += this.a[i] * Math.cos( (i + 1) * x );
            summ += this.b[i] * Math.sin( (i + 1) * x );
        }

        return summ;
    }

    mutate(chance = 0.01, amplitude = Math.PI / 10) {
        if( Math.random() < chance ) {
            if( Math.random() < 0.5 ) {
                this.a0 += amplitude * Math.random();
            } else {
                this.a0 -= amplitude * Math.random();
            }
        }

        for (let i = 0; i < this.length; ++i) {
            if( Math.random() < chance ) {
                if( Math.random() < 0.5 ) {
                    this.a[i] += amplitude * Math.random() / (i+1)**2;
                } else {
                    this.a[i] -= amplitude * Math.random() / (i+1)**2;
                }
            }

            if( Math.random() < chance ) {
                if( Math.random() < 0.5 ) {
                    this.b[i] += amplitude * Math.random() / (i+1)**2;
                } else {
                    this.b[i] -= amplitude * Math.random() / (i+1)**2;
                }
            }
        }
    }

    love (partner) {
        const child = new FourierSeries();

        if ( Math.random() < 0.5 ) {
            child.a0 = this.a0;
        } else {
            child.a0 = partner.a0;
        }

        for (let i = 0; i < this.length; ++i) {
            if( Math.random() < 0.5 ) {
                child.a[i] = this.a[i];
            } else {
                child.a[i] = partner.a[i];
            }

            if( Math.random() < 0.5 ) {
                child.b[i] = this.b[i];
            } else {
                child.b[i] = partner.b[i];
            }
        }

        return child;
    }
}


function xToPx(coordinate) {
    return AXES_X + AXES_WIDTH  / 2 + coordinate / PIXEL_SIZE;
};

function yToPx(coordinate) {
    return AXES_Y + AXES_HEIGHT / 2 - coordinate / PIXEL_SIZE;
};

function xToNum(coordinate) {
    return ( coordinate - AXES_X - AXES_WIDTH  / 2 ) * PIXEL_SIZE;
};

function yToNum(coordinate) {
    return (-coordinate + AXES_Y + AXES_HEIGHT / 2 ) * PIXEL_SIZE;
};


class Button {
    constructor(text = 'button', x = AXES_X + AXES_WIDTH + 20, y = AXES_Y, width = 50, height = 40) {
        this.x = x;
        this.y = y;

        this.width  = width;
        this.height = height;

        this.text = text;
    }

    drawIt(ctx) {
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'Grey';
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = 'Chartreuse';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#007FFF';
        ctx.font = '32px serif';
        ctx.fillText(this.text, this.x + 3, this.y + this.height / 2 + 10, this.width - 3);
    }

    isOverIt(event) {
        if(event.offsetX > this.x  && event.offsetX < this.x + this.width &&
           event.offsetY > this.y  && event.offsetY < this.y + this.height ) {
            return true;
        } else {
            return false;
        }
    }
}

let isPointerDown = 0;

let target;
let isTargetOn = 0;

let isAnimating = 0;

let isDrawing = 1;

const axes = {
    x: AXES_X,
    y: AXES_Y,

    width:  AXES_WIDTH,
    height: AXES_HEIGHT,

    sliders: [],

    series: [],

    generation: 0,

    drawBoard: function(ctx) {
        ctx.fillStyle = 'Black';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },

    drawFrame: function(ctx) {
        ctx.lineWidth = 10;
        ctx.strokeStyle = 'Grey';
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    },

    slidersInit: function(n = 30) {
        this.sliders = [];

        for(let i = 0; i < n; i++) {
            this.sliders.push( new Slider(this.x + (i + 0.5) * this.width / n, this.y + this.height / 2) );
        }
    },

    seriesInit: function(n = 20) {
        this.series = [];

        for(let i = 0; i < n; i++) {
            this.series.push( new FourierSeries() );
        }
    },

    seriesMutate: function() {
        for (const serie of this.series) {
            serie.mutate();
        }
    },

    evolve: function(time = 1) {
        let newGeneration = [];

        for (let t = 0; t < time; ++t) {
            newGeneration = [];


            for (const serie of this.series) {
                serie.good = 0;

                for (const slider of this.sliders) {
                    serie.good += ( yToNum(slider.y) - serie.eval( xToNum(slider.x) ) ) ** 2;
                }

            }

            this.series.sort( (x, y) => x.good - y.good );

            for (let i = 0; i < 10; ++i) {
                console.log(this.generation, i, this.series[i].good);
            }
            console.log('===============')


            for (let i = 0; i < 5; ++i) {
                newGeneration.push( this.series[2].love( this.series[0] ) );
                newGeneration.push( this.series[4].love( this.series[0] ) );

                newGeneration.push( this.series[3].love( this.series[1] ) );
                newGeneration.push( this.series[5].love( this.series[1] ) );
            }

            for (const serie of newGeneration) {
                serie.mutate();
            }

            
            this.series = newGeneration;

            this.generation++;
        }
    },

    drawSliders: function(ctx) {
        for(const slider of this.sliders) {
            slider.drawIt(ctx);
        }
    },

    drawSeries: function(ctx) {
        for( const serie of this.series ) {
            this.drawTheFunction( x => serie.eval(x), serie.color, ctx);
        }
    },

    drawTheFunction: function(theFunction, color, ctx) {
        isDrawing = 1;

        ctx.lineWidth = 3;
        ctx.strokeStyle = color;

        ctx.beginPath();

        ctx.moveTo( this.x, yToPx( theFunction( xToNum(this.x) ) ) );

        for(let i = this.x + 1; i <= this.x + this.width; i++) {
            if ( yToPx( theFunction( xToNum(i) ) ) > AXES_Y &&
                 yToPx( theFunction( xToNum(i) ) ) < AXES_Y + AXES_HEIGHT &&
                 isDrawing ) {
                ctx.lineTo( i, yToPx( theFunction( xToNum(i) ) ) );
            } else if ( yToPx( theFunction( xToNum(i) ) ) > AXES_Y &&
                        yToPx( theFunction( xToNum(i) ) ) < AXES_Y + AXES_HEIGHT &&
                        !isDrawing ) {
                isDrawing = 1;
                ctx.moveTo( i, yToPx( theFunction( xToNum(i) ) ) );
            } else {
                isDrawing = 0;
                ctx.moveTo( i, yToPx( theFunction( xToNum(i) ) ) );
            }
            
            i += 3;
        }

        ctx.stroke();
    },

    isOverIt: function(event) {
        if(event.offsetX > this.x  && event.offsetX < this.x + this.width &&
           event.offsetY > this.y  && event.offsetY < this.y + this.height ) {
            return true;
        } else {
            return false;
        }
    },
};


//init axes and buttons
axes.seriesInit();
axes.slidersInit();


const buttons = [];

buttons.push( new Button('Q', AXES_X + AXES_WIDTH + 20, AXES_Y + AXES_HEIGHT + 20, 50, 50) );
buttons[0].click = () => {
    axes.seriesInit();
    axes.slidersInit();

    axes.generation = 0;
};

buttons.push( new Button('+1',   AXES_X + AXES_WIDTH + 20, 70)  );
buttons[1].click = () => axes.evolve();

buttons.push( new Button('+10',  AXES_X + AXES_WIDTH + 20, 140) );
buttons[2].click = () => {
    isAnimating = 10;
    animate( () => axes.evolve() );
};

buttons.push( new Button('+99', AXES_X + AXES_WIDTH + 20, 210) );
buttons[3].click = () => {
    isAnimating = 99;
    animate( () => axes.evolve() );
};

buttons.push( new Button('Chaos 0', AXES_X, AXES_Y + AXES_HEIGHT + 20, 80, 50) );
buttons[4].click = () => {
    axes.seriesInit();

    axes.generation = 0;
};


buttons.push( new Button('Chaos 1', AXES_X + 96, AXES_Y + AXES_HEIGHT + 20, 80, 50) );
buttons[5].click = () => {
    axes.seriesMutate();
};

buttons.push( new Button('Chaos 10', AXES_X + 192, AXES_Y + AXES_HEIGHT + 20, 95, 50) );
buttons[6].click = () => {
    isAnimating = 10;
    animate( () => axes.seriesMutate() );
};

buttons.push( new Button('Chaos 99', AXES_X + 303, AXES_Y + AXES_HEIGHT + 20, 97, 50) );
buttons[7].click = () => {
    isAnimating = 99;
    animate( () => axes.seriesMutate() );
};


//canvas
const cvs = document.getElementById('boxCanvas');
const ctx = cvs.getContext('2d');

const BoxWidth  = 500;
const BoxHeight = 500;

cvs.width  = BoxWidth;
cvs.height = BoxHeight;
cvs.style.border  = '2px solid grey';


//events
cvs.addEventListener('pointerdown', targetOnClick);

cvs.addEventListener('pointermove', moveByMouse);

window.addEventListener('pointerup', releaseTarget);


//render function
function render() {
    axes.drawFrame(ctx);
    axes.drawBoard(ctx);

    axes.drawSeries(ctx);
    axes.drawSliders(ctx);
}

buttons.map( button => button.drawIt(ctx) );

render();


function animate(animatedFunction) {
    --isAnimating;

    if (isAnimating >= 0) {
        animatedFunction();

        console.log('animation', isAnimating);
        axes.drawFrame(ctx);
        axes.drawBoard(ctx);

        axes.drawSeries(ctx);
        axes.drawSliders(ctx);

        requestAnimationFrame( () => animate(animatedFunction) );
    }
}



function targetOnClick(event) {
    isPointerDown = 1;

    if (!isTargetOn) {
        target = buttons.find( button => button.isOverIt(event) );
        
        if (target !== undefined) {
            target.click();
            target = undefined;

            requestAnimationFrame(render);
        } else {
            target = axes.sliders.find( slider => slider.isOverIt(event) );

            if (target !== undefined) {
                isTargetOn = 1;
            }
        }
    }
}

function moveByMouse(event) {
    if(isTargetOn) {
        target.moveTo(target.x, event.offsetY);
        requestAnimationFrame(render);

        if ( (target.x - event.offsetX)**2 > target.r**2 ) {
            isTargetOn = 0;
        }

    } else if (isPointerDown) {
        target = axes.sliders.find( slider => slider.isOverPath(event) );
        
        if (target !== undefined) {
            isTargetOn = 1;
            target.moveTo(target.x, event.offsetY);
            requestAnimationFrame(render);
        }
    }
}

function releaseTarget(event) {
    isPointerDown = 0;

    if (isTargetOn) {
        target.moveTo(target.x, event.offsetY);
        requestAnimationFrame(render);

        target = undefined;
        isTargetOn = 0;
    }
}