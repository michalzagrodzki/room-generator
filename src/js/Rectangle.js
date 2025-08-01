// Rectangle class for room representation
export class Rectangle {
  constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
  }
  
  // Check if this rectangle overlaps with another
  overlaps(other) {
      return !(this.x + this.width <= other.x || 
              other.x + other.width <= this.x ||
              this.y + this.height <= other.y || 
              other.y + other.height <= this.y);
  }
  
  // Get all border tiles of this rectangle
  getBorderTiles() {
      const tiles = [];
      
      // Top and bottom borders
      for (let x = this.x; x < this.x + this.width; x++) {
          tiles.push({x: x, y: this.y}); // Top
          tiles.push({x: x, y: this.y + this.height - 1}); // Bottom
      }
      
      // Left and right borders (excluding corners already added)
      for (let y = this.y + 1; y < this.y + this.height - 1; y++) {
          tiles.push({x: this.x, y: y}); // Left
          tiles.push({x: this.x + this.width - 1, y: y}); // Right
      }
      
      return tiles;
  }
  
  // Get center point of rectangle
  getCenter() {
      return {
          x: this.x + Math.floor(this.width / 2),
          y: this.y + Math.floor(this.height / 2)
      };
  }
  
  // Check if point is inside rectangle
  contains(x, y) {
      return x >= this.x && x < this.x + this.width &&
             y >= this.y && y < this.y + this.height;
  }
}