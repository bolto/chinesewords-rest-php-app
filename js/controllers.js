'use strict';

/* Controllers */

var chinesewordControllers = angular.module('chinesewordControllers', []);

//ngEnter directive allows binding of "enter" key to function call
chinesewordControllers.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
chinesewordControllers.controller('WordlistWordEditCtrl', ['$rootScope', '$scope', '$location', '$routeParams', '$route', 'WordUtils', 'WordlistWord', 'WordPingying',
    function($rootScope, $scope, $location, $routeParams, $route, WordUtils, WordlistWord, WordPingying) {
        $rootScope.$on('$routeChangeSuccess', function () {
            $scope.id = $location.search()['id'];
            console.log($scope.id);
            $scope.word = WordlistWord.list({id : $scope.id}, function(response){
                console.log($scope.word.symbol);
                $scope.wordpingyings = WordPingying.list({word : $scope.word.symbol}, function (response){
                    $scope.pingyings = [];
                    for(var i = 0; i<$scope.wordpingyings.length; i++){
                        var py = WordUtils.toFormattedPingying($scope.wordpingyings[i].pingying);
                        py.listOrder = $scope.wordpingyings[i].listOrder;
                        py.id = $scope.wordpingyings[i].pingying.id;
                        if(py.listOrder == 1){
                            $scope.defaultPingying = i;
                            $scope.selected = i;
                        }
                        $scope.pingyings.push(py);
                    }
                });
            });
        });
        $scope.init = function init(){
            $scope.id = $location.search()['id'];
            console.log($scope.id);
            $scope.word = WordlistWord.list({id : $scope.id}, function(response){
                console.log($scope.word.symbol);
                $scope.wordpingyings = WordPingying.list({word : $scope.word.symbol}, function (response){
                    $scope.pingyings = [];
                    for(var i = 0; i<$scope.wordpingyings.length; i++){
                        var py = WordUtils.toFormattedPingying($scope.wordpingyings[i].pingying);
                        if ($scope.word.pingying.id == $scope.wordpingyings[i].pingying.id){
                            $scope.currentPingying = i;
                            $scope.selected = i;
                        }
                        py.id = $scope.wordpingyings[i].pingying.id;
                        $scope.pingyings.push(py);
                    }
                });
            });
        };
        $scope.isDirty = false;
        $scope.save = function save(){
            if($scope.currentPingying == $scope.selected)
                return;
            $scope.word.wordPingyingId.pingying.id = $scope.wordpingyings[$scope.selected].pingying.id;
            $scope.word.$update({id : $scope.word.id}, function (response){});
        };
        $scope.setPingying = function setPingying(i){
            $scope.selected = i;
            $scope.isDirty = ($scope.currentPingying != $scope.selected);
        }
    }
]);
chinesewordControllers.controller('WordEditCtrl', ['$scope', 'WordUtils', 'Word', 'WordPingying',
    function($scope, WordUtils, Word, WordPingying) {
        $scope.isDirty = false;
        $scope.loadPingying = function loadPingying(){
            $scope.isDirty = false;
            $scope.wordpingyings = WordPingying.list({word : $scope.search}, function (response){
                $scope.word = $scope.wordpingyings[0].word;
                $scope.pingyings = [];
                for(var i = 0; i<$scope.wordpingyings.length; i++){
                    var py = WordUtils.toFormattedPingying($scope.wordpingyings[i].pingying);
                    py.listOrder = $scope.wordpingyings[i].listOrder;
                    py.id = $scope.wordpingyings[i].pingying.id;
                    if(py.listOrder == 1){
                        $scope.defaultPingying = i;
                        $scope.selected = i;
                    }
                    $scope.pingyings.push(py);
                }
            });
        }
        $scope.save = function save(){
            if($scope.defaultPingying == $scope.selected)
                return;
            for(var i = 0; i<$scope.wordpingyings.length; i++){
                if($scope.selected == i){
                    $scope.wordpingyings[i].listOrder = 1;
                }else{
                    if(i == 0)
                        $scope.wordpingyings[i].listOrder = 2;
                    else
                        $scope.wordpingyings[i].listOrder = i+1;
                }
                $scope.wordpingyings[i].$update({}, function(response){});
            }
        };
        $scope.setDefaultPingying = function setDefaultPingying(i){
            $scope.selected = i;
            $scope.isDirty = ($scope.defaultPingying != $scope.selected);
        }

    }
]);
chinesewordControllers.controller('ProfileListCtrl', ['$scope', 'Profile', 'WordlistProfile', 'Word',
    function($scope, Profile, WordlistProfile, Word) {
        $scope.profiles = Profile.query();
        $scope.toggleShowWordlists = function(profile){
        	profile.isShowWordlists = !profile.isShowWordlists;
        	if(profile.isShowWordlists){
        		$scope.getWordlistsByProfile(profile);
        		$scope.isShowWords = false;
        	}
        };
        $scope.getWordlistsByProfile = function(profile){
        	profile.wordlists = WordlistProfile.query({profileId:profile.id});
        };
        $scope.showWords = function(profile, wordlist){
        	$scope.isShowWords = true;
        	$scope.words = Word.query({profileId:profile.id, wordlistId:wordlist.id});
        }

    }]);
chinesewordControllers.controller('CoreCtrl', ['$scope', 'Word', 'WordUtils',
    function($scope, Word, WordUtils) {
        $scope.word = Word.get({wordId:5245}, function(word){
            $scope.word.wordpingyings = WordPingying.list({word : $scope.word.symbol}, function (response){
                $scope.word.pingyings = [];
                for(var i = 0; i<$scope.wordpingyings.length; i++){
                    var py = WordUtils.toFormattedPingying($scope.wordpingyings[i].pingying);
                    $scope.word.pingyings.push(py);
                }
            });
            $scope.word.fw = WordUtils.toFormattedWord(word);
        });
    }]);
chinesewordControllers.controller('Test2Ctrl', ['$scope', 'Test', 'WordlistAll', 'WordUtils', 'WordPingying', 'WordlistWord',
    function ($scope, Test, WordlistAll, WordUtils, WordPingying, WordlistWord) {
        $scope.word = WordlistWord.get({id : 5408}, function(response){
            $scope.word.isShowPingyingSelect = false;
            $scope.word.selected_py_id = $scope.word.pingying.id;
            $scope.word.formatted_word = WordUtils.toFormattedWord($scope.word, WordUtils.FormatStyle.STANDARD);
            var wordpingyings = WordPingying.list({word : $scope.word.symbol}, function (response){
                $scope.word.pingyings = [];
                $scope.word.pys_container_width = "" + wordpingyings.length * 26 + "px";
                for(var i = 0; i< wordpingyings.length; i++){
                    var py = WordUtils.toFormattedPingying(wordpingyings[i].pingying);
                    py.id = wordpingyings[i].pingying.id;
                    $scope.word.pingyings.push(py);
                }
            });
        });
        $scope.word.fw = WordUtils.toFormattedWord($scope.word);
        $scope.hidePingyingSelect = function hidePingyingSelect(word){
            word.isShowPingyingSelect = false;
        }
        $scope.showPingyingSelect = function showPingyingSelect(word){
            word.isShowPingyingSelect = true;
        }
        $scope.updateWordlistWordPingying = function updateWordlistWordPingying(word, py){
            if(word.pingying.id == py.id){return;}
            word.selected_py_id = py.id;
            var wordUpdate = WordlistWord.get({id : word.id}, function(response){
                delete wordUpdate.wordPingyingId.pingying;
                wordUpdate.wordPingyingId.pingying = new Object();
                wordUpdate.wordPingyingId.pingying.id = py.id;
                delete wordUpdate.wordPingyingId.word;
                wordUpdate.wordPingyingId.word = new Object();
                wordUpdate.wordPingyingId.word.id = word.id;
                delete wordUpdate.pingying;
                wordUpdate.$update({id : word.id}, function (response){
                    word = response;
                    word.formatted_word = WordUtils.toFormattedWord(word, WordUtils.FormatStyle.STANDARD);
                    $scope.word.pingying = word.pingying;
                    $scope.word.formatted_word = word.formatted_word;
                });
            });
        }
    }]);
chinesewordControllers.controller(
    'TestCtrl', ['$scope', 'Test', 'WordlistAll','Pingying', 'WordUtils',
    'WordPingying', 'WordlistWord', 'TestWordlist',
    function ($scope, Test, WordlistAll, Pingying, WordUtils, WordPingying, WordlistWord, TestWordlist) {
        $scope.tests = Test.list();
        $scope.isDirty = false;
        $scope.isShowLetter = true;
        $scope.isShowPingying = true;
        $scope.isPingyingEditHoverEnabled = true;
        $scope.total_words = 0;
        $scope.lines = [];
        $scope.showWordlists = function showWordlists(test){
            $scope.isDirty = false;
            $scope.test = Test.get({testId:test.id}, function (response) {
                $scope.testWordlists = TestWordlist.list({testId:test.id});
                $scope.wordlists = WordlistAll.list(function (response) {
                    angular.forEach(response, function (item) {
                        item.selected = $scope.isExistingWordlist(item);
                        $scope.updateStatus();
                    });
                });
            });
        };
        $scope.hidePingyingSelect = function hidePingyingSelect(word){
            word.isShowPingyingSelect = false;
        }
        $scope.showPingyingSelect = function showPingyingSelect(word){
            if(!$scope.isPingyingEditHoverEnabled)
                return;
            word.isShowPingyingSelect = true;
            if (typeof word.pingying.id == 'undefined'){
                return;
            }
            word.selected_py_id = word.pingying.id;
            if(word.pys_container_width == undefined){
                word.pys_container_width = "26px";
            }else{
                /* this return is needed as otherwise there is a chance of making REST call
                                    more than once due to the time it takes to complete the asyn call*/
                return;
            }
            if(word.selectable_pingyings == undefined && word.pingyings.length > 1){
                word.pys_container_width = "" + word.pingyings.length * 26 + "px";
                word.selectable_pingyings = [];
                for(var i = 0; i<word.pingyings.length; i++){
                    var py = WordUtils.toFormattedPingyingForEdit(word.pingyings[i]);
                    if (word.pingying.id == word.pingyings[i].id){
                        word.currentPingying = i;
                        word.selected = i;
                    }
                    py.id = word.pingyings[i].id;
                    word.selectable_pingyings.push(py);
                }
            }
        }
        $scope.isExistingWordlist = function isExistingWordlist(wordlist){
            for(var i=0; i< $scope.testWordlists.length; i++){
                if(wordlist.id == $scope.testWordlists[i].id){
                    return true;
                }
            }
            return false;
        };
        $scope.getSelectedIdList = function getSelectedIdList(){
            var list = [];
            for(var i = 0; i < $scope.wordlists.length; i++){
                if($scope.wordlists[i].selected){
                    list[list.length] = $scope.wordlists[i].id;
                }
            }
            return list;
        };
        $scope.getExistingIdList = function getExistingIdList(){
            // returns a list of currently associated wordlists for the given test
            var list = [];
            if($scope.testWordlists === undefined)
                return list;
            if($scope.testWordlists.length === undefined)
                return list;
            for(var i = 0; i < $scope.testWordlists.length; i++){
                list[list.length] = $scope.testWordlists[i].id;
            }
            return list;
        };
        $scope.selectWordlist = function selectWordlist(wordlist){
            wordlist.selected = !wordlist.selected;
            $scope.updateStatus();
        };
        $scope.clearWordlistSelection = function clearWordlistSelection(){
            for(var i = 0; i < $scope.wordlists.length; i++){
                // only un-select current selected ones
                if($scope.wordlists[i].selected == true)
                    $scope.selectWordlist($scope.wordlists[i]);
            }
        };
        $scope.selectAllWordlistSelection = function selectAllWordlistSelection(){
            for(var i = 0; i < $scope.wordlists.length; i++){
                // only select current un-selected ones
                if($scope.wordlists[i].selected == false)
                    $scope.selectWordlist($scope.wordlists[i]);
            }
        };
        $scope.restoreWordlistSelection = function restoreWordlistSelection(){
            for(var i = 0; i < $scope.wordlists.length; i++){
                if ($scope.wordlists[i].selected != $scope.isExistingWordlist($scope.wordlists[i]))
                    $scope.selectWordlist($scope.wordlists[i]);
            }
        };
        $scope.clickIsShowPingying = function clickIsShowPingying(){
            $scope.isShowPingying = !$scope.isShowPingying;
        };
        $scope.clickIsShowLetter = function clickIsShowLetter(){
            $scope.isShowLetter = !$scope.isShowLetter;
        };
        $scope.clickIsPingyingEditHoverEnabled = function clickIsPingyingEditHoverEnabled(){
            $scope.isPingyingEditHoverEnabled = !$scope.isPingyingEditHoverEnabled;
        };
        $scope.isWordsReady = function isWordsReady(){
            if($scope.isDirty)
                return false;
            if($scope.test === undefined)
                return false;
            if($scope.wordlists === undefined)
                return false;
            if($scope.wordlists.length == 0)
                return false;
            if($scope.getExistingIdList().length == 0)
                return false;
            return true;
        };
        $scope.updateStatus = function updateStatus(){
            for(var i = 0; i < $scope.wordlists.length; i++){
                if ($scope.isExistingWordlist($scope.wordlists[i]) != $scope.wordlists[i].selected){
                    $scope.isDirty = true;
                    return;
                }
            }
            // not sure why this line is needed but save button doesn't get enabled/disabled
            // correctly without this line.
            $scope.isDirty = false;
        };
        $scope.save = function save(){
            /**
             * Go through wordlist entries with checkboxes.  Delete unselected entries and
             * put (save) selected entries.
             */
            for (var index = 0; index < $scope.wordlists.length; ++index) {
                var newTestWordlist = new TestWordlist();
                var wordlistId = $scope.wordlists[index].id;
                if($scope.wordlists[index].selected){
                    if (!$scope.isExistingWordlist($scope.wordlists[index]))
                        newTestWordlist.$update({testId:$scope.test.id, wordlistId:wordlistId});
                }else{
                    if ($scope.isExistingWordlist($scope.wordlists[index]))
                        newTestWordlist.$delete({testId:$scope.test.id, wordlistId:wordlistId});
                }
            }
            $scope.showWordlists($scope.test);
        };
        $scope.listWordsFromWordlist = function listWordsFromWordlist(wordlistId){
            return WordlistWord.list({wordlistId:wordlistId}, function (response) {

            });
        };
        $scope.list = function list(){
            $scope.total_words = 0;
            var words = [];
            $scope.lines = [];

            for(var i = 0; i < $scope.testWordlists.length; i++){
                $scope.testWordlists[i].wordlistWords
                    = WordlistWord.list({wordlistId:$scope.testWordlists[i].wordlist_id}, function (response) {
                    angular.forEach(response, function (item) {
                        var wordlistWord = item;
                        wordlistWord.isShowPingyingSelect = false;
                        if(WordUtils.hasPingying(wordlistWord))
                            $scope.total_words ++;
                        wordlistWord.formatted_word = WordUtils.toFormattedWord(wordlistWord, WordUtils.FormatStyle.STANDARD);//WordUtils
                        if((wordlistWord.symbol == undefined || wordlistWord.symbol.trim() == "")){
                            if(words.length > 0){
                                $scope.lines.push(words);
                                words = [];
                            }
                        }else{
                            words.push(wordlistWord);
                        }
                    });
                    if(words.length > 0){
                        $scope.lines.push(words);
                        words = [];
                    }
                });
            }
            $scope.showWords();
        };
        $scope.hasPingying = function hasPingying(word){
            return WordUtils.toFormattedWord(word, WordUtils.FormatStyle.STANDARD);
        };
        $scope.generate = function generate(){
            // generates a given size of random words
            $scope.total_words = 0;
            $scope.lines = [];
            var wordMap = {};
            for(var i = 0; i < $scope.testWordlists.length; i++){
                for(var j = 0; j < $scope.testWordlists[i].wordlistWords.length; j++){
                    var word = $scope.testWordlists[i].wordlistWords[j];
                    if(WordUtils.hasPingying(word)) {
                        // note this may overwrite the word with the same word.id
                        // but we will deal with this later
                        // as we also need to deal with multiple pingyings for a word
                        // so there should be a nested map that stores all pingying variants
                        wordMap[word.id] = word;
                    }
                }
            };
            // target size is the number of random words to be taken from the combined list of words
            var targetSize = 0;
            if(!isNaN($scope.num_words)){
                targetSize = parseInt($scope.num_words);
            }
            // convert hashmap to array for easier processing
            var mapToArray = [];
            for(var i in wordMap){
                mapToArray.push(wordMap[i]);
            };
            // if words are less than target size, target size is set to the number of words instead
            if(mapToArray.length < targetSize){
                targetSize = mapToArray.length;
            };
            var words = [];
            while(words.length < targetSize){
                var random = Math.floor((Math.random() * mapToArray.length)) ;
                var word = mapToArray[random];
                word.formatted_word = WordUtils.toFormattedWord(word, WordUtils.FormatStyle.STANDARD);
                words.push(word);
                // remove the pushed word from array to avoid repeats
                mapToArray.splice(random, 1);
            };
            $scope.total_words = words.length;
            $scope.lines.push(words);

            $scope.showWords();
        };
        $scope.showWords = function showWords(){
            $scope.isShowWords = true;
        };
        $scope.editWordlistWordPingying = function editWordlistWordPingying(word){
            if($scope.isPingyingEditLinkEnabled)
                window.open("http://" + location.host + "/chinese/index.html#/wordlist_word?id=" + word.id,'_blank');
        };
        $scope.updateWordlistWordPingying = function updateWordlistWordPingying(word, py){
            if(word.pingying.id == py.id){return;}
            word.selected_py_id = py.id;
            var wordUpdate = WordlistWord.get({id : word.id}, function(response){
                //delete wordUpdate.wordPingyingId.pingying;
                //wordUpdate.wordPingyingId.pingying = new Object();
                //wordUpdate.wordPingyingId.pingying.id = py.id;
                //delete wordUpdate.wordPingyingId.word;
                //wordUpdate.wordPingyingId.word = new Object();
                //wordUpdate.wordPingyingId.word.id = word.id;
                //delete wordUpdate.pingying;
                wordUpdate.pingying_id = py.id;
                wordUpdate.$update({id : word.id}, function (retWord){
                    word.formatted_word = WordUtils.toFormattedWord(retWord, WordUtils.FormatStyle.STANDARD);
                    word.pingying = retWord.pingying;
                    word.selected_py_id = retWord.pingying.id;
                });
            });
        }
    }]);
chinesewordControllers.controller('WordlistFormCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.formData = {};
        $scope.processForm = function processForm() {
            $http({
                method: 'POST',
                url:  window.location.protocol + '//' + window.location.hostname + ':8080/api/wordlists/addWordlist',
                data: $.param($scope.formData),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            })
                .success(function (data) {
                    console.log(data);

                    if (!data.success) {
                        // if not successful, bind errors to error variables
                        $scope.info = data.errors;
                    } else {
                        // if successful, bind success message to message
                        $scope.info = data.message;
                    }
                    $scope.status = (data.success) ? "Successful!" : "Failed";
                });
        };
    }
]);
chinesewordControllers.controller('WordlistListCtrl', ['$scope', 'Wordlist',
    function($scope, Wordlist) {
        $scope.getWordlistsByProfileId = function(id){
    	$scope.wordlists = Wordlist.query({profileId:id});
    }
    }]);
chinesewordControllers.controller('ProfileCtrl', ['$scope', 'Word',
    function($scope, Word) {
        $scope.words = Word.query();
    }]);
