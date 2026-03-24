/* Trello Card ID Power-Up */

var ICON_URL = 'https://mrmP.github.io/TrelloCardID/icon.svg';

function formatId(num, pad) {
  var n = parseInt(num, 10);
  var p = (pad !== undefined && pad !== null) ? parseInt(pad, 10) : 4;
  return p === 0 ? String(n) : String(n).padStart(p, '0');
}

function getLabel(t) {
  return Promise.all([
    t.card('id'),
    t.get('board', 'shared', 'cardIdMap'),
    t.get('board', 'shared', 'prefix'),
    t.get('board', 'shared', 'postfix'),
    t.get('board', 'shared', 'padding')
  ]).then(function(vals) {
    var cardId = vals[0].id;
    var idMap = vals[1] || {};
    var num = idMap[cardId];
    if (!num) return null;
    return (vals[2] || '') + formatId(num, vals[4]) + (vals[3] || '');
  });
}

TrelloPowerUp.initialize({

  'card-badges': function(t) {
    return getLabel(t).then(function(label) {
      if (!label) return [];
      return [{ text: label, color: 'blue' }];
    });
  },

  'card-detail-badges': function(t) {
    return getLabel(t).then(function(label) {
      if (!label) return [];
      return [{ title: 'Card ID', text: label, color: 'blue' }];
    });
  },

  'card-back-section': function(t) {
    return {
      title: 'Card ID',
      icon: ICON_URL,
      content: {
        type: 'iframe',
        url: t.signUrl('card-section.html'),
        height: 110
      }
    };
  },

  'board-buttons': function(t) {
    return [
      {
        text: 'Card ID Settings',
        icon: { dark: ICON_URL, light: ICON_URL },
        callback: function(t) {
          return t.popup({ title: 'Card ID Settings', url: 'settings.html', height: 320 });
        }
      },
      {
        text: 'Debug Card IDs',
        icon: { dark: ICON_URL, light: ICON_URL },
        callback: function(t) {
          return t.popup({ title: 'Card ID Debug', url: 'debug.html', height: 300 });
        }
      }
    ];
  },

  'card-buttons': function(t) {
    return Promise.all([
      t.card('id'),
      t.get('board', 'shared', 'cardIdMap')
    ]).then(function(vals) {
      var cardId = vals[0].id;
      var idMap = vals[1] || {};
      if (idMap[cardId]) return [];
      return [{
        text: 'Assign Card ID',
        callback: function(t) { return assignNextId(t); }
      }];
    });
  }

}, {
  appKey: '2e23b655e062b3728cc2635e6f537b97',
  appName: 'Card ID Power-Up'
});

function assignNextId(t) {
  return Promise.all([
    t.card('id'),
    t.get('board', 'shared', 'cardIdMap')
  ]).then(function(vals) {
    var cardId = vals[0].id;
    var idMap = vals[1] || {};
    var maxId = 0;
    Object.values(idMap).forEach(function(n) {
      var num = parseInt(n, 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    });
    idMap[cardId] = String(maxId + 1);
    return t.set('board', 'shared', 'cardIdMap', idMap).then(function() {
      return t.closePopup();
    });
  });
}
