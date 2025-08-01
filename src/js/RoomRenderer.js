import { TILE_TYPES } from './RoomGenerator.js';

// Constants
const TILE_SIZE = 16;

const COLORS = {
    [TILE_TYPES.EMPTY]: '#f5f5f5',
    [TILE_TYPES.WALL]: '#2196F3',
    GRID: '#333333'
};

// Renderer Class
export class RoomRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
    }
    
    render(grid) {
        const width = grid[0].length;
        const height = grid.length;
        
        this.canvas.width = width * TILE_SIZE;
        this.canvas.height = height * TILE_SIZE;
        
        // Clear canvas with empty color
        this.ctx.fillStyle = COLORS[TILE_TYPES.EMPTY];
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.drawGrid(width, height);
        
        // Draw tiles
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (grid[y][x] === TILE_TYPES.WALL) {
                    this.drawWallTile(x, y);
                }
            }
        }
    }
    
    drawGrid(width, height) {
        this.ctx.strokeStyle = COLORS.GRID;
        this.ctx.lineWidth = 0.3;
        this.ctx.globalAlpha = 0.3;
        
        // Vertical lines
        for (let x = 0; x <= width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * TILE_SIZE, 0);
            this.ctx.lineTo(x * TILE_SIZE, height * TILE_SIZE);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * TILE_SIZE);
            this.ctx.lineTo(width * TILE_SIZE, y * TILE_SIZE);
            this.ctx.stroke();
        }
        
        this.ctx.globalAlpha = 1.0;
    }
    
    drawWallTile(x, y) {
        const pixelX = x * TILE_SIZE;
        const pixelY = y * TILE_SIZE;
        
        // Fill wall tile
        this.ctx.fillStyle = COLORS[TILE_TYPES.WALL];
        this.ctx.fillRect(pixelX + 1, pixelY + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        
        // Add slight border for wall tiles
        this.ctx.strokeStyle = '#1976D2';
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.8;
        this.ctx.strokeRect(pixelX + 1, pixelY + 1, TILE_SIZE - 2, TILE_SIZE - 2);
        this.ctx.globalAlpha = 1.0;
    }
}