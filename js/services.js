'use strict';

/* Services */

var chinesewordServices = angular.module('chinesewordServices', ['ngResource']);
var server_url = 'http://rest-prj-1.com/api/v1'
chinesewordServices.factory('Profile', ['$resource',
    function($resource){
        return $resource(server_url + '/profile/', {}, {
            query: {method:'GET', params:{}, isArray:true}
        });
    }]);

chinesewordServices.factory('Test', ['$resource',
    function($resource){
        return $resource(server_url + '/test/:testId', {}, {
            list: {method:'GET', params:{testId:''}, isArray:true},
            get: {method:'GET', params:{testId:'@testId'}, isArray:false},
            post:{method:'POST', params:{testId:''}},
            update: {method:'PUT', params:{testId:'@testId'}},
            "delete":{method:'DELETE', params:{testId:'@testId'}}
        });
    }]);
chinesewordServices.factory('Word', ['$resource',
    function($resource){
        return $resource(server_url + '/word/', {}, {
            list: {method:'GET', params:{search:'@search'}, isArray:true},
            get: {method:'GET', params:{wordId:'@wordId'}, isArray:false},
            post:{method:'POST', params:{wordId:''}},
            update: {method:'PUT', params:{wordId:'@wordId'}},
            "delete":{method:'DELETE', params:{wordId:'@wordId'}}
        });
    }]);
chinesewordServices.factory('Wordlist', ['$resource',
    function($resource){
        return $resource(server_url + '/wordlist/:wordlistId/', {name:'@name', words:'@words'}, {
            post: {method:'POST', params:{name:'@name', words:'@words'}}
        });
    }]);
chinesewordServices.factory('WordPingying', ['$resource',
    function($resource){
        return $resource(server_url + '/word/:wordId/pingying/:pingyingId', {}, {
            get: {method:'GET', params:{wordId:'@wordId', pingyingId:'@pingyingId'}, isArray:false},
            list: {method:'GET', params:{wordId:'@wordId', pingyingId:''}, isArray:true},
            update: {method:'PUT', params:{}}
        });
    }]);
chinesewordServices.factory('Pingying', ['$resource',
    function($resource){
        return $resource(server_url + '/pingying/:pingyingId/', {}, {
            get: {method:'GET', params:{pingyingId:'@pingyingId'}, isArray:false},
            list: {method:'GET', params:{pingyingId:''}, isArray:true}
        });
    }]);
chinesewordServices.factory('WordlistWord', ['$resource',
    function($resource){
        return $resource(server_url + '/wordlist/:wordlistId/word/:wordId', {}, {
            list: {method:'GET', params:{wordlistId:'@wordlistId', wordId:'' }, isArray:true},
            update: {method:'PUT', params:{id:'@id'}}
        });
    }]);
chinesewordServices.factory('TestWordlist', ['$resource',
    function($resource){
        return $resource(server_url + '/test/:testId/wordlist/:wordlistId', {}, {
            list: {method:'GET', params:{testId:'@testId', wordlistId:''}, isArray:true},
            get: {method:'GET', params:{testId:'@testId', wordlistId:'@wordlistId'}, isArray:false},
            post:{method:'POST', params:{testId:'@testId'}},
            update: {method:'PUT', params:{testId:'@testId', wordlistId:'@wordlistId'}},
            delete:{method:'DELETE', params:{testId:'@testId', wordlistId:'@wordlistId'}}
        });
    }]);

chinesewordServices.factory('PingyingCharacter', ['$resource',
    function($resource){
        return $resource(server_url + '/pingying_character', {}, {
            list: {method:'GET', params:{}, isArray:true}
        });
    }]);
chinesewordServices.factory('Tone', ['$resource',
    function($resource){
        return $resource(server_url + '/tones', {}, {
            list: {method:'GET', params:{}, isArray:true}
        });
    }]);

chinesewordServices.factory('WordlistProfile', ['$resource',
    function($resource){
        return $resource(server_url + '/profile/:profileId/wordlist/',
            {}, {
            query: {method:'GET', params:{profileId:'@profileId'}, isArray:true}
        });
    }
]);

chinesewordServices.factory('WordlistTest', ['$resource',
    function($resource){
        return $resource(server_url + '/test/:testId/wordlist/',
            {}, {
                query: {method:'GET', params:{testId:'@testId'}, isArray:true}
            });
    }
]);

chinesewordServices.factory('WordlistAll', ['$resource',
    function($resource){
        return $resource(server_url + '/wordlist/',
            {}, {
                list: {method:'GET', params:{}, isArray:true}
            });
    }
]);

chinesewordServices.factory('WordlistTest', ['$resource',
    function($resource){
        return $resource(server_url + '/test/:testId/wordlist/',
            {}, {
                query: {method:'GET', params:{}, isArray:true}
            });
    }
]);
