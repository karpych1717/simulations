'use strict'

class circle {
    constructor(x, y, r) {
        this.offsetX = x;
        this.offsetY = y;
        this.r = r;
    }

    distanceTo(obj) {
        return Math.sqrt( (obj.offsetX - this.offsetX)**2 + (obj.offsetY - this.offsetY)**2 );
    }

    isOverIt(obj) {
        return distanceTo(obj) <= this.r ? true : false;
    }
}

class rectangle {
    constructor(x, y, width, height) {
        this.offsetX = x;
        this.offsetY = y;
        this.width   = width;
        this.height  = height;
    }

    isOverIt(obj) {
        if ( obj.offsetX < this.offsetX ) {
            return false;
        }
        if ( obj.offsetY < this.offsetY ) {
            return false;
        }
        if ( obj.offsetX > this.offsetX + this.width ) {
            return false;
        }
        if ( obj.offsetY > this.offsetY + this.height ) {
            return false;
        }

        return true;
    }
}