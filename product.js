export default function handler(req, res) {
  const fullUrl = req.url;
  const productPath = fullUrl.split('/products/')[1];
  
  // Extract product handle (remove query parameters if any)
  const productHandle = productPath ? productPath.split('?')[0] : '';
  
  // Your configuration
  const shopifyDomain = 'mirrorglassworldwide.com';
  const flutterAppScheme = 'mirrorglassworldwide://';
  const appStoreUrl = 'https://apps.apple.com/your-app-id'; // Replace with your iOS App Store URL
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.yourcompany.celestialjewel'; // Replace with your Google Play URL
  const vercelDomain = 'your-deep-links.vercel.app'; // Replace with your actual Vercel domain
  
  // Get user agent to detect device
  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  // URLs
  const appDeepLink = `${flutterAppScheme}product/${productHandle}`;
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirecting to Celestial Jewel...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script type="text/javascript">
        // Detect platform
        const isIOS = ${isIOS};
        const isAndroid = ${isAndroid};
        let appOpened = false;
        
        function openApp() {
            // Try to open the Flutter app
            window.location.href = '${appDeepLink}';
            
            // Set timeout to check if app opened
            setTimeout(function() {
                if (!appOpened) {
                    // App not installed, redirect to appropriate store
                    if (isIOS) {
                        window.location.href = '${appStoreUrl}';
                    } else if (isAndroid) {
                        window.location.href = '${playStoreUrl}';
                    } else {
                        window.location.href = '${webUrl}';
                    }
                }
            }, 1500);
        }
        
        // Detect if app was successfully opened
        window.onblur = function() {
            appOpened = true;
        };
        
        // Page visibility API for better detection
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                appOpened = true;
            }
        });
        
        // Start the process when page loads
        window.onload = function() {
            openApp();
        };
        
        // Fallback - if still on page after 2.5 seconds, redirect
        setTimeout(function() {
            if (!appOpened) {
                if (isIOS) {
                    window.location.href = '${appStoreUrl}';
                } else if (isAndroid) {
                    window.location.href = '${playStoreUrl}';
                } else {
                    window.location.href = '${webUrl}';
                }
            }
        }, 2500);
    </script>
</head>
<body style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
    <div style="text-align: center;">
        <h1>🌙 Celestial Jewel</h1>
        <p>Opening the app...</p>
        <div style="margin-top: 20px;">
            <a href="${webUrl}" style="color: white; text-decoration: underline;">Open in Browser Instead</a>
        </div>
    </div>
</body>
</html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
