// LDtk-style JSON exporter for room layouts
export class RoomExporter {
    constructor() {
        this.tileSize = 16;
    }
    
    // Convert grid to LDtk-style gridTiles format
    exportToLDtkFormat(grid, roomGenerator) {
        const width = grid[0].length;
        const height = grid.length;
        const gridTiles = [];
        
        // Calculate total tiles for coordinate mapping
        let tileIndex = 0;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tileType = grid[y][x];
                
                // Only export wall tiles (non-empty tiles)
                if (tileType === 1) { // WALL type
                    const tile = this.createLDtkTile(x, y, tileType, tileIndex);
                    gridTiles.push(tile);
                }
                tileIndex++;
            }
        }
        
        // Generate unique identifiers
        const uid = Math.floor(Math.random() * 1000000);
        const iid = this.generateIID();
        const layerIid = this.generateIID();
        
        // Create complete LDtk-style level structure
        const levelData = {
            identifier: "GeneratedRoom",
            iid: iid,
            uid: uid,
            worldX: 0,
            worldY: 0,
            worldDepth: 0,
            pxWid: width * this.tileSize,
            pxHei: height * this.tileSize,
            __bgColor: "#696A79",
            bgColor: null,
            useAutoIdentifier: false,
            bgRelPath: null,
            bgPos: null,
            bgPivotX: 0.5,
            bgPivotY: 0.5,
            __smartColor: "#ADADB5",
            __bgPos: null,
            externalRelPath: null,
            fieldInstances: [],
            layerInstances: [
                {
                    __identifier: "Tiles",
                    __type: "Tiles",
                    __cWid: width,
                    __cHei: height,
                    __gridSize: this.tileSize,
                    __opacity: 1,
                    __pxTotalOffsetX: 0,
                    __pxTotalOffsetY: 0,
                    __tilesetDefUid: 1,
                    __tilesetRelPath: "atlas/classicAutoTiles.aseprite",
                    iid: layerIid,
                    levelId: uid,
                    layerDefUid: 2,
                    pxOffsetX: 0,
                    pxOffsetY: 0,
                    visible: true,
                    optionalRules: [],
                    intGridCsv: [],
                    autoLayerTiles: [],
                    seed: Math.floor(Math.random() * 10000000),
                    overrideTilesetUid: null,
                    gridTiles: gridTiles,
                    entityInstances: []
                }
            ],
            __neighbours: [],
            metadata: {
                generatedAt: new Date().toISOString(),
                roomCount: roomGenerator ? roomGenerator.rooms.length : 0,
                connected: roomGenerator ? roomGenerator.areAllRoomsConnected() : false,
                generator: "2D-Room-Generator",
                version: "1.0.0"
            }
        };
        
        return levelData;
    }
    
    // Generate LDtk-style IID (Instance ID)
    generateIID() {
        // LDtk IIDs follow pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        const chars = '0123456789abcdef';
        const segments = [8, 4, 4, 4, 12];
        
        return segments.map(length => {
            return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        }).join('-');
    }
    
    // Create individual LDtk tile object
    createLDtkTile(x, y, tileType, dataIndex) {
        // Calculate pixel position
        const px = [x * this.tileSize, y * this.tileSize];
        
        // Determine tile source based on surrounding tiles context
        // For now, using simple mapping - can be enhanced for auto-tiling
        const src = this.getTileSource(tileType);
        
        return {
            px: px,           // Pixel coordinates in the level
            src: src,         // Source coordinates in tileset
            f: 0,             // Flip bits (0=no flip, 1=X, 2=Y, 3=XY)
            t: tileType,      // Tile ID in tileset
            d: [dataIndex],   // Data array (tile index in grid)
            a: 1              // Alpha transparency (1 = opaque)
        };
    }
    
    // Get tileset source coordinates based on tile type
    getTileSource(tileType) {
        // Simple mapping - in a real tileset, this would be more sophisticated
        const tileMap = {
            0: [0, 0],    // Empty (not used in export)
            1: [16, 0]    // Wall tile - using middle tile from LDtk tileset
        };
        
        return tileMap[tileType] || [16, 0];
    }
    
    // Export and download as JSON file
    downloadJson(data, filename = 'room_layout.json') {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Open JSON in new window for viewing
    openJsonInNewWindow(data) {
        const jsonString = JSON.stringify(data, null, 2);
        const newWindow = window.open('', '_blank');
        
        newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Room Layout JSON</title>
                <style>
                    body {
                        font-family: 'Courier New', monospace;
                        margin: 20px;
                        background-color: #1e1e1e;
                        color: #d4d4d4;
                    }
                    .header {
                        background: #2d2d30;
                        padding: 15px;
                        border-radius: 5px;
                        margin-bottom: 20px;
                        border-left: 4px solid #007acc;
                        position: relative;
                    }
                    .header h1 {
                        margin: 0;
                        color: #ffffff;
                    }
                    .header p {
                        margin: 5px 0 0 0;
                        color: #cccccc;
                    }
                    .copy-btn {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        background: transparent;
                        color: #cccccc;
                        border: 1px solid #555;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: all 0.2s;
                    }
                    .copy-btn:hover {
                        color: #ffffff;
                        border-color: #007acc;
                        background: rgba(0, 122, 204, 0.1);
                    }
                    .copy-btn.copied {
                        color: #4CAF50;
                        border-color: #4CAF50;
                    }
                    pre {
                        background: #252526;
                        border: 1px solid #3e3e42;
                        border-radius: 5px;
                        padding: 20px;
                        overflow: auto;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        line-height: 1.4;
                    }
                    .download-btn {
                        background: #007acc;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        margin-bottom: 20px;
                    }
                    .download-btn:hover {
                        background: #005a9e;
                    }
                    .json-string { color: #ce9178; }
                    .json-number { color: #b5cea8; }
                    .json-boolean { color: #569cd6; }
                    .json-null { color: #569cd6; }
                    .json-key { color: #9cdcfe; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Room Layout JSON Export</h1>
                    <p>LDtk-compatible format • Generated at ${new Date().toLocaleString()}</p>
                    <button class="copy-btn" onclick="copyToClipboard()">Copy</button>
                </div>
                <button class="download-btn" onclick="downloadFile()">Download JSON File</button>
                <pre id="json-content">${this.syntaxHighlight(jsonString)}</pre>
                
                <script>
                    const jsonData = ${jsonString};
                    
                    function downloadFile() {
                        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'room_layout_' + new Date().toISOString().split('T')[0] + '.json';
                        a.click();
                        URL.revokeObjectURL(url);
                    }
                    
                    function copyToClipboard() {
                        const jsonText = JSON.stringify(jsonData, null, 2);
                        
                        navigator.clipboard.writeText(jsonText).then(() => {
                            const copyBtn = document.querySelector('.copy-btn');
                            const originalText = copyBtn.textContent;
                            
                            // Show success feedback
                            copyBtn.textContent = 'Copied!';
                            copyBtn.classList.add('copied');
                            
                            // Reset after 2 seconds
                            setTimeout(() => {
                                copyBtn.textContent = originalText;
                                copyBtn.classList.remove('copied');
                            }, 2000);
                        }).catch(err => {
                            console.error('Failed to copy: ', err);
                            alert('Failed to copy to clipboard. Please select and copy manually.');
                        });
                    }
                </script>
            </body>
            </html>
        `);
        
        newWindow.document.close();
    }
    
    // Syntax highlighting for JSON
    syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
}