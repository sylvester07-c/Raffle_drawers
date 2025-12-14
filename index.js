var initialNames = ['Mummy', 'Daddy', 'Sylvia', 'Stepheany', 'Blessing', 'Glory', 'Praise', 'Grace', 'Peace', 'Riches'];
        var remainingNames = [];
        var drawnNames = [];
        var db = null;

 

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
  
const firebaseConfig = {
  apiKey: "AIzaSyBK9YpwOvsuYs9dVGgkq5abO00-l1w2W6Q",
  authDomain: "raffle-drawer-app.firebaseapp.com",
  projectId: "raffle-drawer-app",
  storageBucket: "raffle-drawer-app.firebasestorage.app",
  messagingSenderId: "109815525328",
  appId: "1:109815525328:web:5107aaefdd6d48f53e53d5",
  measurementId: "G-CTSNHL38GQ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

        firebase.initializeApp(firebaseConfig);
        db = firebase.database();

        function loadRaffleData() {
            db.ref('raffle').on('value', function(snapshot) {
                if (snapshot.exists()) {
                    var data = snapshot.val();
                    drawnNames = data.drawnNames || [];
                    remainingNames = data.remainingNames || [];
                } else {
                    drawnNames = [];
                    remainingNames = initialNames.slice();
                    db.ref('raffle').set({
                        remainingNames: remainingNames,
                        drawnNames: drawnNames
                    });
                }
                renderNames();
                renderDrawnNames();
                document.getElementById('loadingMsg').classList.add('hidden');
            });
        }

        function renderNames() {
            var grid = document.getElementById('namesGrid');
            grid.innerHTML = '';

            if (remainingNames.length === 0) {
                grid.innerHTML = '<div class="empty-message">All participants have been selected!</div>';
                return;
            }

            for (var i = 0; i < initialNames.length; i++) {
                var name = initialNames[i];
                var card = document.createElement('div');
                card.className = 'name-card';
                
                var isDrawn = drawnNames.indexOf(name) !== -1;
                
                if (isDrawn) {
                    card.classList.add('disabled');
                }
                
                card.textContent = name;
                card.onclick = (function(n) {
                    return function() {
                        if (!isDrawn) {
                            selectName(n);
                        }
                    };
                })(name);
                grid.appendChild(card);
            }

            document.getElementById('counter').textContent = remainingNames.length;
        }

        function renderDrawnNames() {
            var drawnSection = document.getElementById('drawnSection');
            var drawnList = document.getElementById('drawnList');

            if (drawnNames.length === 0) {
                drawnSection.classList.add('hidden');
                return;
            }

            drawnSection.classList.remove('hidden');
            drawnList.innerHTML = '';

            for (var i = 0; i < drawnNames.length; i++) {
                var name = drawnNames[i];
                var badge = document.createElement('div');
                badge.className = 'drawn-badge';
                badge.textContent = name;
                drawnList.appendChild(badge);
            }
        }

        function selectName(name) {
            if (drawnNames.indexOf(name) !== -1) return;

            var winnerDisplay = document.getElementById('winnerDisplay');
            var winnerName = document.getElementById('winnerName');
            winnerDisplay.classList.remove('hidden');
            winnerName.textContent = name;

            var newRemaining = [];
            for (var i = 0; i < remainingNames.length; i++) {
                if (remainingNames[i] !== name) {
                    newRemaining.push(remainingNames[i]);
                }
            }
            remainingNames = newRemaining;
            drawnNames.push(name);

            db.ref('raffle').set({
                remainingNames: remainingNames,
                drawnNames: drawnNames
            });
        }

        function resetRaffle() {
            remainingNames = initialNames.slice();
            drawnNames = [];
            document.getElementById('winnerDisplay').classList.add('hidden');
            
            db.ref('raffle').set({
                remainingNames: remainingNames,
                drawnNames: drawnNames
            });
        }

        loadRaffleData();
        console.log('valid');