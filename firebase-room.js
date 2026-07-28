// Модуль синхронизации "комнаты" для двух игроков через Firestore.
// Транспорт only: создать/войти в комнату, опубликовать общее состояние
// (раунд/очки/твист) и своё войско, подписаться на состояние комнаты и
// на войско соперника. Игровые правила живут в index.html.
// Общается с ним через window.SBRoom (без модульных импортов там).

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {
  getFirestore, doc, setDoc, updateDoc, onSnapshot, collection,
  serverTimestamp, getDoc
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

var firebaseConfig = {
  apiKey: 'AIzaSyCOB5kNk_Cvj8MxvcgZt0G5bGujez8h8ss',
  authDomain: 'spearhead-tracker.firebaseapp.com',
  projectId: 'spearhead-tracker',
  storageBucket: 'spearhead-tracker.firebasestorage.app',
  messagingSenderId: '1083578275858',
  appId: '1:1083578275858:web:73bd6b1ee680b4609c60cb'
};

var app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var db = getFirestore(app);

var authReady = new Promise(function (resolve) {
  onAuthStateChanged(auth, function (user) {
    if (user) resolve(user.uid);
  });
  signInAnonymously(auth).catch(function (err) {
    console.error('[SBRoom] anon auth failed', err);
  });
});

function makeRoomCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // без похожих символов
  var out = '';
  for (var i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function createRoom() {
  return authReady.then(function (uid) {
    var code = makeRoomCode();
    var roomRef = doc(db, 'rooms', code);
    return setDoc(roomRef, {
      createdAt: serverTimestamp(),
      hostUid: uid,
      round: 1,
      vp: { p1: 0, p2: 0 },
      side: 'ossia',
      twistDeck: [],
      twistLog: []
    }).then(function () {
      return { code: code, uid: uid };
    });
  });
}

function joinRoom(code) {
  code = String(code || '').trim().toUpperCase();
  return authReady.then(function (uid) {
    var roomRef = doc(db, 'rooms', code);
    return getDoc(roomRef).then(function (snap) {
      if (!snap.exists()) throw new Error('room-not-found');
      return { code: code, uid: uid };
    });
  });
}

function publishShared(code, payload) {
  if (!code) return Promise.resolve();
  var roomRef = doc(db, 'rooms', code);
  return updateDoc(roomRef, Object.assign({ updatedAt: serverTimestamp() }, payload));
}

function publishSelf(code, uid, payload) {
  if (!code || !uid) return Promise.resolve();
  var playerRef = doc(db, 'rooms', code, 'players', uid);
  return setDoc(playerRef, Object.assign({ updatedAt: serverTimestamp() }, payload), { merge: true });
}

function subscribeRoom(code, cb) {
  var roomRef = doc(db, 'rooms', code);
  return onSnapshot(roomRef, function (snap) {
    cb(snap.exists() ? snap.data() : null);
  });
}

function subscribeOthers(code, myUid, cb) {
  var playersRef = collection(db, 'rooms', code, 'players');
  return onSnapshot(playersRef, function (snap) {
    var others = [];
    snap.forEach(function (d) {
      if (d.id !== myUid) others.push(Object.assign({ uid: d.id }, d.data()));
    });
    cb(others);
  });
}

window.SBRoom = {
  ready: authReady,
  createRoom: createRoom,
  joinRoom: joinRoom,
  publishShared: publishShared,
  publishSelf: publishSelf,
  subscribeRoom: subscribeRoom,
  subscribeOthers: subscribeOthers
};
window.dispatchEvent(new CustomEvent('sbroom-ready'));
