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
      
      // Create complete LDtk-style level structure
      const levelData = {
          identifier: "GeneratedRoom",
          uid: Math.floor(Math.random() * 1000000),
          worldX: 0,
          worldY: 0,
          worldDepth: 0,
          pxWid: width * this.tileSize,
          pxHei: height * this.tileSize,
          layerInstances: [
              {
                  __identifier: "Walls",
                  __type: "Tiles",
                  __cWid: width,
                  __cHei: height,
                  __gridSize: this.tileSize,
                  __opacity: 1,
                  __pxTotalOffsetX: 0,
                  __pxTotalOffsetY: 0,
                  __tilesetDefUid: 1,
                  __tilesetRelPath: "tileset.png",
                  layerDefUid: 1,
                  levelId: 0,
                  pxOffsetX: 0,
                  pxOffsetY: 0,
                  visible: true,
                  gridTiles: gridTiles,
                  autoLayerTiles: []
              }
          ],
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
          1: [0, 0]     // Wall tile
      };
      
      return tileMap[tileType] || [0, 0];
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
                  }
                  .header h1 {
                      margin: 0;
                      color: #ffffff;
                  }
                  .header p {
                      margin: 5px 0 0 0;
                      color: #cccccc;
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
              </div>
              <button class="download-btn" onclick="downloadFile()">Download JSON File</button>
              <pre id="json-content">${this.syntaxHighlight(jsonString)}</pre>
              
              <script>
                  function downloadFile() {
                      const jsonData = ${jsonString};
                      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'room_layout_' + new Date().toISOString().split('T')[0] + '.json';
                      a.click();
                      URL.revokeObjectURL(url);
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