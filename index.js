/* Trello Card ID Power-Up */

var ICON_URL = 'https://mrmP.github.io/TrelloCardID/icon.svg';

var BADGE_COLORS = ['blue','green','orange','red','purple','pink','sky','lime','light-gray','null'];

function formatId(num, pad) {
  var n = parseInt(num, 10);
  var p = (pad !== undefined && pad !== null) ? parseInt(pad, 10) : 4;
  return p === 0 ? String(n) : String(n).padStart(p, '0');
}

function getBadgeData(t) {
  return Promise.all([
    t.card('id'),
    t.get('board', 'shared', 'cardIdMap'),
    t.get('board', 'shared', 'prefix'),
    t.get('board', 'shared', 'postfix'),
    t.get('board', 'shared', 'padding'),
    t.get('board', 'shared', 'badgeColor')
  ]).then(function(vals) {
    var cardId = vals[0].id;
    var idMap = vals[1] || {};
    var num = idMap[cardId];
    if (!num) return null;
    var label = (vals[2] || '') + formatId(num, vals[4]) + (vals[3] || '');
    var color = (vals[5] !== undefined && vals[5] !== null) ? vals[5] : 'null';
    return { text: label, color: color === 'null' ? null : color };
  });
}

TrelloPowerUp.initialize({

  'card-badges': function(t) {
    return getBadgeData(t).then(function(badge) {
      if (!badge) return [];
      var b = { text: badge.text };
      if (badge.color) b.color = badge.color;
      return [b];
    });
  },

  'card-detail-badges': function(t) {
    return getBadgeData(t).then(function(badge) {
      if (!badge) return [];
      var b = { title: 'Card ID', text: badge.text };
      if (badge.color) b.color = badge.color;
      return [b];
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
    return [{
      text: 'Card ID Settings',
      icon: { dark: ICON_URL, light: ICON_URL },
      callback: function(t) {
        return t.popup({ title: 'Card ID Settings', url: 'settings.html', height: 360 });
      }
    }];
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
