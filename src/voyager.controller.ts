import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class VoyagerController {
  @Get('voyager')
  serveVoyager(@Res() res: Response) {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GraphQL Voyager - SA Academy API</title>
          <link rel="stylesheet" href="voyager.css" />
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            }
            #voyager {
              height: 100vh;
            }
            .loading {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              font-size: 18px;
              color: #666;
            }
            .error {
              color: #d32f2f;
              padding: 20px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div id="voyager">
            <div class="loading">Loading GraphQL Voyager...</div>
          </div>
          
          <script>
            // Error handling for script loading
            window.addEventListener('error', function(e) {
              console.error('Script error:', e);
              document.getElementById('voyager').innerHTML = 
                '<div class="error">Error loading Voyager. Please check the console for details.</div>';
            });
            
            // Load Voyager script (using the correct lib file)
            const script = document.createElement('script');
            script.src = 'voyager.lib.js';
            script.onload = function() {
              console.log('Voyager script loaded successfully');
              initVoyager();
            };
            script.onerror = function() {
              console.error('Failed to load voyager.lib.js');
              document.getElementById('voyager').innerHTML = 
                '<div class="error">Failed to load Voyager script. Please check if the server is running correctly.</div>';
            };
            document.head.appendChild(script);
            
            function initVoyager() {
              try {
                if (typeof GraphQLVoyager === 'undefined') {
                  throw new Error('GraphQLVoyager is not defined');
                }
                
                GraphQLVoyager.init(document.getElementById('voyager'), {
                  introspection: introspectionProvider,
                  displayOptions: {
                    skipRelay: true,
                    showLeafFields: true,
                    sortByAlphabet: true,
                  },
                });
                
                console.log('Voyager initialized successfully');
              } catch (error) {
                console.error('Error initializing Voyager:', error);
                document.getElementById('voyager').innerHTML = 
                  '<div class="error">Error initializing Voyager: ' + error.message + '</div>';
              }
            }
            
            function introspectionProvider(query) {
              console.log('Making introspection query:', query);
              return fetch('/graphql', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query }),
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('GraphQL request failed: ' + response.status);
                }
                return response.json();
              })
              .then(data => {
                console.log('Introspection response received');
                return data;
              })
              .catch(error => {
                console.error('Introspection error:', error);
                throw error;
              });
            }
          </script>
        </body>
      </html>
    `);
  }
} 