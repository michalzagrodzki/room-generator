import { Rectangle } from './Rectangle.js';

// Constants
export const TILE_TYPES = {
    EMPTY: 0,
    WALL: 1
};

// Room Generator Class
export class RoomGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = this.createEmptyGrid();
        this.rooms = [];
        this.interiorGrid = this.createEmptyGrid();
    }
    
    createEmptyGrid() {
        return Array(this.height).fill().map(() => 
            Array(this.width).fill(TILE_TYPES.EMPTY)
        );
    }
    
    generateRandomRoom(minSize, maxSize) {
        // Random dimensions
        const width = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        const height = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
        
        // Random position (ensure room fits within canvas)
        const maxX = this.width - width;
        const maxY = this.height - height;
        
        if (maxX <= 0 || maxY <= 0) return null;
        
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        
        return new Rectangle(x, y, width, height);
    }
    
    generateRooms(roomCount, minSize, maxSize) {
        this.rooms = [];
        this.grid = this.createEmptyGrid();
        this.interiorGrid = this.createEmptyGrid();
        
        // Generate first room
        let attempts = 0;
        while (this.rooms.length === 0 && attempts < 100) {
            const room = this.generateRandomRoom(minSize, maxSize);
            if (room) {
                this.rooms.push(room);
            }
            attempts++;
        }
        
        // Generate remaining rooms, ensuring they connect to existing rooms
        for (let i = 1; i < roomCount; i++) {
            const connectedRoom = this.generateConnectedRoom(minSize, maxSize);
            if (connectedRoom) {
                this.rooms.push(connectedRoom);
            }
        }
        
        // Mark all interior spaces
        this.markInteriorSpaces();
        
        // Draw only the outer border
        this.drawOuterBorder();
        
        return this.grid;
    }
    
    generateConnectedRoom(minSize, maxSize) {
        let attempts = 0;
        
        while (attempts < 100) {
            const room = this.generateRandomRoom(minSize, maxSize);
            if (room && this.isConnectedToExisting(room)) {
                return room;
            }
            attempts++;
        }
        
        // If no connected room found, try to create one adjacent to existing rooms
        for (const existingRoom of this.rooms) {
            const adjacentRoom = this.generateAdjacentRoom(existingRoom, minSize, maxSize);
            if (adjacentRoom) {
                return adjacentRoom;
            }
        }
        
        return null;
    }
    
    generateAdjacentRoom(existingRoom, minSize, maxSize) {
        const directions = [
            {dx: 1, dy: 0},   // Right
            {dx: -1, dy: 0},  // Left
            {dx: 0, dy: 1},   // Below
            {dx: 0, dy: -1}   // Above
        ];
        
        for (const dir of directions) {
            const width = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
            const height = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
            
            let x, y;
            
            if (dir.dx === 1) { // Right
                x = existingRoom.x + existingRoom.width;
                y = existingRoom.y + Math.floor(Math.random() * existingRoom.height) - Math.floor(height / 2);
            } else if (dir.dx === -1) { // Left
                x = existingRoom.x - width;
                y = existingRoom.y + Math.floor(Math.random() * existingRoom.height) - Math.floor(height / 2);
            } else if (dir.dy === 1) { // Below
                x = existingRoom.x + Math.floor(Math.random() * existingRoom.width) - Math.floor(width / 2);
                y = existingRoom.y + existingRoom.height;
            } else { // Above
                x = existingRoom.x + Math.floor(Math.random() * existingRoom.width) - Math.floor(width / 2);
                y = existingRoom.y - height;
            }
            
            const newRoom = new Rectangle(x, y, width, height);
            
            if (this.isValidRoom(newRoom) && this.isConnectedToExisting(newRoom)) {
                return newRoom;
            }
        }
        
        return null;
    }
    
    isValidRoom(room) {
        return room.x >= 0 && room.y >= 0 && 
               room.x + room.width < this.width && 
               room.y + room.height < this.height;
    }
    
    isConnectedToExisting(newRoom) {
        return this.rooms.some(existingRoom => 
            newRoom.overlaps(existingRoom) || this.areAdjacent(newRoom, existingRoom)
        );
    }
    
    areAdjacent(room1, room2) {
        // Check if rooms are touching (adjacent)
        const horizontal = (room1.x + room1.width === room2.x || room2.x + room2.width === room1.x) &&
                          !(room1.y + room1.height <= room2.y || room2.y + room2.height <= room1.y);
        
        const vertical = (room1.y + room1.height === room2.y || room2.y + room2.height === room1.y) &&
                        !(room1.x + room1.width <= room2.x || room2.x + room2.width <= room1.x);
        
        return horizontal || vertical;
    }
    
    markInteriorSpaces() {
        // Mark all spaces that are inside any room
        this.rooms.forEach(room => {
            for (let y = room.y; y < room.y + room.height; y++) {
                for (let x = room.x; x < room.x + room.width; x++) {
                    if (this.isValidPosition(x, y)) {
                        this.interiorGrid[y][x] = 1; // Mark as interior
                    }
                }
            }
        });
    }
    
    drawOuterBorder() {
        // Clear grid first
        this.grid = this.createEmptyGrid();
        
        // For each interior cell, check if it's on the outer border
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.interiorGrid[y][x] === 1) {
                    // Check all 4 directions
                    const neighbors = [
                        {dx: 0, dy: -1}, // Up
                        {dx: 1, dy: 0},  // Right
                        {dx: 0, dy: 1},  // Down
                        {dx: -1, dy: 0}  // Left
                    ];
                    
                    for (const neighbor of neighbors) {
                        const nx = x + neighbor.dx;
                        const ny = y + neighbor.dy;
                        
                        // If neighbor is outside bounds or not interior, this is a border
                        if (!this.isValidPosition(nx, ny) || this.interiorGrid[ny][nx] === 0) {
                            this.grid[y][x] = TILE_TYPES.WALL;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    isValidPosition(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    
    // Get room statistics
    getRoomStats() {
        const overlappingPairs = [];
        
        for (let i = 0; i < this.rooms.length; i++) {
            for (let j = i + 1; j < this.rooms.length; j++) {
                if (this.rooms[i].overlaps(this.rooms[j])) {
                    overlappingPairs.push([i, j]);
                }
            }
        }
        
        // Count connected components to verify all rooms are connected
        const connected = this.areAllRoomsConnected();
        
        return {
            totalRooms: this.rooms.length,
            overlappingPairs: overlappingPairs.length,
            rooms: this.rooms,
            allConnected: connected
        };
    }
    
    areAllRoomsConnected() {
        if (this.rooms.length <= 1) return true;
        
        const visited = new Set();
        const stack = [0]; // Start with first room
        visited.add(0);
        
        while (stack.length > 0) {
            const currentIdx = stack.pop();
            const currentRoom = this.rooms[currentIdx];
            
            // Find all rooms connected to current room
            for (let i = 0; i < this.rooms.length; i++) {
                if (!visited.has(i)) {
                    const otherRoom = this.rooms[i];
                    if (currentRoom.overlaps(otherRoom) || this.areAdjacent(currentRoom, otherRoom)) {
                        visited.add(i);
                        stack.push(i);
                    }
                }
            }
        }
        
        return visited.size === this.rooms.length;
    }
}