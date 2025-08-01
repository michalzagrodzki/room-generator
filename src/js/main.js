import { RoomGenerator } from './RoomGenerator.js';
import { RoomRenderer } from './RoomRenderer.js';

// Application class
class RoomGeneratorApp {
    constructor() {
        this.renderer = null;
        this.generator = null;
    }
    
    init() {
        this.renderer = new RoomRenderer('roomCanvas');
        this.generateRooms(); // Generate initial rooms
        console.log('Room Generator App initialized');
    }
    
    generateRooms() {
        const canvasWidth = parseInt(document.getElementById('canvasWidth').value);
        const canvasHeight = parseInt(document.getElementById('canvasHeight').value);
        const roomCount = parseInt(document.getElementById('roomCount').value);
        const minRoomSize = parseInt(document.getElementById('minRoomSize').value);
        const maxRoomSize = parseInt(document.getElementById('maxRoomSize').value);
        
        // Validate input
        if (maxRoomSize < minRoomSize) {
            alert('Max room size must be greater than or equal to min room size');
            return;
        }
        
        this.generator = new RoomGenerator(canvasWidth, canvasHeight);
        const grid = this.generator.generateRooms(roomCount, minRoomSize, maxRoomSize);
        
        this.renderer.render(grid);
        
        // Display stats
        const stats = this.generator.getRoomStats();
        console.log(`Generated ${stats.totalRooms} rooms with ${stats.overlappingPairs} overlapping pairs`);
        console.log(`All rooms connected: ${stats.allConnected}`);
        
        // Update info text
        const infoDiv = document.getElementById('statsInfo');
        infoDiv.innerHTML = `
            Generates rectangular and square rooms that are all connected. Only the outer border of the combined shape is rendered.<br>
            <strong>Stats:</strong> ${stats.totalRooms} rooms, ${stats.overlappingPairs} overlaps, Connected: ${stats.allConnected ? '✅ Yes' : '❌ No'}
        `;
    }
}

// Global app instance
window.app = new RoomGeneratorApp();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.app.init();
});