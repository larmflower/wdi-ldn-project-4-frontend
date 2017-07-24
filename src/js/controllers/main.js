angular
.module('finalProject')
.controller('MainCtrl', MainCtrl);

// MainCtrl.$inject = ['$auth', '$state', 'newsService', 'filterFilter', '$scope']; //>>>>>>>???? filterFilter
// function MainCtrl($auth, $state, newsService, filterFilter, $scope) {
MainCtrl.$inject = ['$auth', '$state', '$rootScope', '$scope', '$transitions', 'filterFilter', 'newsService'];
function MainCtrl($auth, $state, $rootScope, $scope, $transitions, filterFilter, newsService) {
  const vm = this;
  // vm.all = Main.query(); //>>?????? service.query?

  function filterArticles(){ //>>>>>????? this function
    const params = { description: vm.q };
    vm.filtered = filterFilter(vm.articles, params);
  }

  vm.isAuthenticated = $auth.isAuthenticated;

  vm.logout = logout;

  $rootScope.$on('error', (e, err) => {
    vm.stateHasChanged = false;

    if(err.status === 401) {
      vm.message = err.data.message;
      $state.go('login');
    }
  });

  $transitions.onSuccess({}, (transition) => {
    vm.pageName = transition.$to().name;
    if(vm.stateHasChanged) vm.message = null;
    if(!vm.stateHasChanged) vm.stateHasChanged = true;
  });

  function logout() {
    $auth.logout();
    $state.go('home');
  }

  vm.articles = [];

  function getArticle(get) { //this function knows nothing jon snow, it's a shoe down a well

    newsService.getNews(get)
    .then((res)=>{
      vm.articles = res.articles;
      filterArticles();

    });// object
    // vm.articles = newsService.getNews(get);

  }

  vm.getArticle = getArticle;

  $scope.$watchGroup([ //><>>>>??? scope
    () => vm.q
  ], filterArticles);

}
