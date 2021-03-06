myApp = angular.module('starter');
var adminUUU = "http://192.168.1.107:80"
var adminurl = adminUUU + '/api/';
io.sails.url = adminUUU;
myApp.factory('apiService', function ($http, $q, $timeout) {
    return {
        // This is a demo Service for POST Method.
        doLogin: function (data, id, callback) {
            $http.post(adminurl + 'Dealer/login', {
                mobile: data.mobile,
                youTubeUrl: data.link,
                password: data.password,
                tableId: data.tableId,
                socketId: id
            }).then(function (data) {
                callback(data);
            });
        },
        connectSocket: function (accessToken, socketIds, callback) {
            $http.post(adminurl + 'Dealer/connectSocket', {
                accessToken: accessToken,
                socketId: socketIds
            }).then(function (data) {
                callback(data);
            });
        },
        callApiWithData: function (url, data, callback) {
            $http.post(adminurl + url, data).then(function (data) {
                callback(data);
            });
        },
        revealCards: function (callback) {
            $http.post(adminurl + 'Player/revealCards').then(function (data) {
                callback(data);
            });
        },
        getAll: function (tableId, callback) {
            console.log(tableId);
            $http.post(adminurl + 'Player/getAllDetails', {
                tableId: tableId
            }).then(function (data) {
                callback(data);
            });
        },
        makeDealerByDealer: function (tableId, playerNo, callback) {
            $http.post(adminurl + 'Player/makeDealerByDealer', {
                tableId: tableId,
                playerNo: playerNo
            }).then(function (data) {
                callback(data);
            });
        },
        getAllTable: function (callback) {
            $http.post(adminurl + 'Table/getAllTable').then(function (data) {
                callback(data);
            });
        },
        newGame: function (tableId, callback) {
            var isDealer = "true"
            $http.post(adminurl + 'Player/newGame', {
                tableId: tableId,
                isDealer: isDealer
            }).then(function (data) {
                callback(data);
            });
        },
        call: function (callback) {
            $http.post(adminurl + 'Player/call').then(function (data) {
                callback(data);
            });
        },
        check: function (callback) {
            $http.post(adminurl + 'Player/check').then(function (data) {
                callback(data);
            });
        },
        fold: function (callback) {
            $http.post(adminurl + 'Player/fold').then(function (data) {
                callback(data);
            });
        },
        addTab: function (data, callback) {
            $http.post(adminurl + 'Player/addTab', data).then(function (data) {
                callback(data);
            });
        },
        makeDealer: function (data, callback) {
            $http.post(adminurl + 'Player/makeDealer', data).then(function (data) {
                callback(data);
            });
        },
        removeTab: function (data, callback) {
            $http.post(adminurl + 'Player/removeTab', data).then(function (data) {
                callback(data);
            });
        },
        showWinner: function (callback) {
            $http.post(adminurl + 'Player/showWinner').then(function (data) {
                callback(data);
            });
        },
        allIn: function (callback) {
            $http.post(adminurl + 'Player/allIn').then(function (data) {
                callback(data);
            });
        },
        raise: function (callback) {
            $http.post(adminurl + 'Player/raise').then(function (data) {
                callback(data);
            });
        },
        randomCard: function () {
            var cardValue = cards[_.random(0, cards.length - 3)].name;
            $http.post(adminurl + 'Player/randomServe', {
                card: cardValue
            }).then(function (data) {
                console.log(data.data);
            });
        },
        removeCard: function (cardNo) {
            $http.post(adminurl + 'CommunityCards/removeCards', {
                cardIndex: cardNo
            }).then(function (data) {
                console.log(data.data);
            });
        },
        undo: function (callback) {
            $http.post(adminurl + 'GameLogs/undo').then(function (data) {
                console.log(data.data);
            });
        },
        getSettings: function (callback) {
            $http.post(adminurl + 'Setting/search', {}).then(function (data) {
                callback(data.data);
            });
        },
        storeSettings: function (data, callback) {
            $http.post(adminurl + 'Setting/store', data).then(function (data) {
                callback(data.data);
            });
        },
        getAdminUrl: function () {
            return $.jStorage.get("adminurl");
        },
        saveAdminUrl: function (adminurl) {
            $.jStorage.set("adminurl", adminurl);
        },
        showPlayerCard: function (player, callback) {
            $http.post(adminurl + 'Player/showPlayerCard', player).then(function (data) {
                callback(data.data);
            });
        }
    };
});
myApp.filter('declareWinner', function () {
    return function (input, data) {
        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].player == input) {
                    return true;
                }
            }
        }
        return false;
    };
});