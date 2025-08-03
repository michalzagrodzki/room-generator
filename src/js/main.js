import { RoomGenerator } from './RoomGenerator.js';
import { RoomRenderer } from './RoomRenderer.js';
import { RoomExporter } from './RoomExporter.js';

// Application class
class RoomGeneratorApp {
    constructor() {
        this.renderer = null;
        this.generator = null;
        this.exporter = null;
        this.currentGrid = null;
    }
    
    init() {
        this.renderer = new RoomRenderer('roomCanvas');
        this.exporter = new RoomExporter();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Generate initial rooms
        this.generateRooms();
        
        console.log('Room Generator App initialized');
    }
    
    setupEventListeners() {
        const generateBtn = document.getElementById('generateBtn');
        const exportBtn = document.getElementById('exportBtn');
        
        generateBtn.addEventListener('click', () => this.generateRooms());
        exportBtn.addEventListener('click', () => this.exportToJson());
        
        // Set up pixel label updates
        this.setupPixelLabels();
    }
    
    setupPixelLabels() {
        const TILE_SIZE = 16;
        
        // Canvas width
        const canvasWidthInput = document.getElementById('canvasWidth');
        const widthPixelsLabel = document.getElementById('widthPixels');
        
        canvasWidthInput.addEventListener('input', (e) => {
            const cells = parseInt(e.target.value) || 0;
            const pixels = cells * TILE_SIZE;
            widthPixelsLabel.textContent = `${cells} cells / ${pixels}px`;
        });
        
        // Canvas height
        const canvasHeightInput = document.getElementById('canvasHeight');
        const heightPixelsLabel = document.getElementById('heightPixels');
        
        canvasHeightInput.addEventListener('input', (e) => {
            const cells = parseInt(e.target.value) || 0;
            const pixels = cells * TILE_SIZE;
            heightPixelsLabel.textContent = `${cells} cells / ${pixels}px`;
        });
        
        // Min room size
        const minRoomSizeInput = document.getElementById('minRoomSize');
        const minRoomPixelsLabel = document.getElementById('minRoomPixels');
        
        minRoomSizeInput.addEventListener('input', (e) => {
            const cells = parseInt(e.target.value) || 0;
            const pixels = cells * TILE_SIZE;
            minRoomPixelsLabel.textContent = `${cells} cells / ${pixels}px`;
        });
        
        // Max room size
        const maxRoomSizeInput = document.getElementById('maxRoomSize');
        const maxRoomPixelsLabel = document.getElementById('maxRoomPixels');
        
        maxRoomSizeInput.addEventListener('input', (e) => {
            const cells = parseInt(e.target.value) || 0;
            const pixels = cells * TILE_SIZE;
            maxRoomPixelsLabel.textContent = `${cells} cells / ${pixels}px`;
        });
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
        this.currentGrid = this.generator.generateRooms(roomCount, minRoomSize, maxRoomSize);
        
        this.renderer.render(this.currentGrid);
        
        // Enable export button
        const exportBtn = document.getElementById('exportBtn');
        exportBtn.disabled = false;
        
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
    
    exportToJson() {
        if (!this.currentGrid || !this.generator) {
            alert('Please generate a room layout first!');
            return;
        }
        
        try {
            // Export to LDtk format
            const ldtkData = this.exporter.exportToLDtkFormat(this.currentGrid, this.generator);
            
            // Open in new window for viewing
            this.exporter.openJsonInNewWindow(ldtkData);
            
            console.log('Room layout exported to JSON:', ldtkData);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export room layout. Check console for details.');
        }
    }
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new RoomGeneratorApp();
    app.init();
});