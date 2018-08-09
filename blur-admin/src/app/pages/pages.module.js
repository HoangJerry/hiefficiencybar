/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
	'use strict';

	angular.module('BlurAdmin.pages', [
		'ui.router',

		'BlurAdmin.pages.dashboard',
		// 'BlurAdmin.pages.ui',
		// 'BlurAdmin.pages.components',
		// 'BlurAdmin.pages.form',
		// 'BlurAdmin.pages.tables',
		// 'BlurAdmin.pages.charts',
		// 'BlurAdmin.pages.maps',
		// ============ tivi showing ============
		'BlurAdmin.pages.tivi-showing',
		// ============ fifo ============
		'BlurAdmin.pages.list-fifo',
		// ============ user profile =============
		'BlurAdmin.pages.profile',
		// =============== manager user ===========
		'BlurAdmin.pages.list-user',
		'BlurAdmin.pages.create-user',
		// ============= separate ===========
		'BlurAdmin.pages.create-separate-glass',
		'BlurAdmin.pages.list-separate-glass',
		'BlurAdmin.pages.detail-separate-glass',
		// ============ manager ingredient ==========
		// -------- ingredient types --------
		'BlurAdmin.pages.list-ingredient-types',
		'BlurAdmin.pages.create-ingredient-types',
		'BlurAdmin.pages.detail-ingredient-types',
		// ------- ingredient brand ---------
		'BlurAdmin.pages.list-ingredient-brand',
		'BlurAdmin.pages.create-ingredient-brand',
		'BlurAdmin.pages.detail-ingredient-brand',
		// ------ ingredient -----------
		'BlurAdmin.pages.list-ingredient',
		'BlurAdmin.pages.create-ingredient',
		'BlurAdmin.pages.detail-ingredient',
		// --------- ingredient import -----
		'BlurAdmin.pages.import-ingredient',
		// --------- ingredient list history -----
		'BlurAdmin.pages.list-history-ingredient',
		// ============ garnish ==============
		'BlurAdmin.pages.list-garnish',
		'BlurAdmin.pages.create-garnish',
		'BlurAdmin.pages.detail-garnish',
		// ============ manager drink ================
		// ------------ drink type -------------
		'BlurAdmin.pages.list-drink-types',
		'BlurAdmin.pages.create-drink-types',
		'BlurAdmin.pages.detail-drink-types',
		// ----------- drink ------------
		'BlurAdmin.pages.list-drink',
		'BlurAdmin.pages.create-drink',
		'BlurAdmin.pages.detail-drink',
		// ============ categories ================
		'BlurAdmin.pages.list-categories',
		'BlurAdmin.pages.create-categories',
		'BlurAdmin.pages.detail-categories',
		// ============ order ================
		'BlurAdmin.pages.list-order',
		// 'BlurAdmin.pages.create-order',
		'BlurAdmin.pages.detail-order',
		'BlurAdmin.pages.order-carts',
		// ============ robot ================
		'BlurAdmin.pages.list-robot',
		'BlurAdmin.pages.import-robot',
		'BlurAdmin.pages.detail-robot',
		// -------- history --------
		'BlurAdmin.pages.list-history',
		'BlurAdmin.pages.create-history',
		'BlurAdmin.pages.detail-history',
		// =========== settings ==============
		'BlurAdmin.pages.settings',
		// =========== hmi ==============
		'BlurAdmin.pages.hmi',
		// =========== stats ==============
		'BlurAdmin.pages.stats',
	])
		.config(routeConfig);

	/** @ngInject */
	function routeConfig($urlRouterProvider, baSidebarServiceProvider, $locationProvider) {
		$urlRouterProvider.otherwise('/dashboard');

		// $locationProvider.html5Mode(true);

		baSidebarServiceProvider.addStaticItem({
			title: 'Pages',
			icon: 'ion-document',
			subMenu: [
				{
					title: 'Sign In',
					fixedHref: 'auth.html',
					blank: true
				}, {
					title: 'Sign Up',
					fixedHref: 'reg.html',
					blank: true
				},
				// ============== tivi showing =======
				{
					title : 'Tivi Showing',
					stateRef : 'tivi-showing'
				},
				// ============== Fifo =======
				{
					title : 'List Fifo',
					stateRef : 'list-fifo'
				},
				// ============== user ===============
				{
					title: 'User Profile',
					stateRef: 'profile'
				},
				{
					title: 'List User',
					stateRef: 'list-user'
				},
				{
					title: 'Create User',
					stateRef: 'create-user'
				},
				// ============== separate ============
				{
					title: 'Separate Glass Create',
					stateRef: 'create-separate-glass'
				},
				{
					title: 'Separate Glass List',
					stateRef: 'list-separate-glass'
				},
				{
					title: 'Separate Glass Detail',
					stateRef: 'detail-separate-glass/:id'
				},
				// ========= ingredient ==============
				{
					title: 'Ingredient Types List',
					stateRef: 'list-ingredient-types'
				},
				{
					title: 'Ingredient Types Create',
					stateRef: 'create-ingredient-types'
				},
				{
					title: 'Ingredient Types Detail',
					stateRef: 'detail-ingredient-types/:id'
				},
				{
					title: 'Ingredient Brand List',
					stateRef: 'list-ingredient-brand'
				},
				{
					title: 'Ingredient Brand Create',
					stateRef: 'create-ingredient-brand'
				},
				{
					title: 'Ingredient Brand Detail',
					stateRef: 'detail-ingredient-brand/:id'
				},
				{
					title: 'Ingredient List',
					stateRef: 'list-ingredient'
				},
				{
					title: 'Ingredient Create',
					stateRef: 'create-ingredient'
				},
				{
					title: 'Ingredient Detail',
					stateRef: 'detail-ingredient/:id'
				},
				{
					title: 'Ingredient Import',
					stateRef: 'import-ingredient'
				},
				{
					title: 'Ingredient History',
					stateRef: 'list-history-ingredient'
				},
				// ============ Garnish ===============
				{
					title: 'Garnish List',
					stateRef: 'list-garnish'
				},
				{
					title: 'Garnish Create',
					stateRef: 'create-garnish'
				},
				{
					title: 'Garnish Detail',
					stateRef: 'detail-garnish/:id'
				},
				// ============= Drink ===============
				{
					title: 'Drink List',
					stateRef: 'list-drink'
				},
				{
					title: 'Drink Create',
					stateRef: 'create-drink'
				},
				{
					title: 'Drink Detail',
					stateRef: 'detail-drink/:id'
				},
				// ============= Drink Types ===============
				{
					title: 'Drink Types List',
					stateRef: 'list-drink-types'
				},
				{
					title: 'Drink Types Create',
					stateRef: 'create-drink-types'
				},
				{
					title: 'Drink Types Detail',
					stateRef: 'detail-drink-types/:id'
				},
				// ============= Categories ===============
				{
					title: 'Categories List',
					stateRef: 'list-categories'
				},
				{
					title: 'Categories Create',
					stateRef: 'create-categories'
				},
				{
					title: 'Categories Detail',
					stateRef: 'detail-categories/:id'
				},
				// ============= Order ===============
				{
					title: 'Order List',
					stateRef: 'list-order'
				},
				// {
				// 	title: 'Order Create',
				// 	stateRef: 'create-order'
				// },
				{
					title: 'Order Detail',
					stateRef: 'detail-order/:id'
				},
				{
					title: 'Order Carts',
					stateRef: 'order-carts'
				},
				// ============= Robot ===============
				{
					title: 'Robot List',
					stateRef: 'list-robot'
				},
				{
					title: 'Robot Import',
					stateRef: 'import-robot'
				},
				{
					title: 'Robot Detail',
					stateRef: 'detail-robot/:id'
				},
				// ---------- history ---------
				{
					title: 'History List',
					stateRef: 'list-history'
				},
				{
					title: 'History Create',
					stateRef: 'create-history'
				},
				{
					title: 'History Detail',
					stateRef: 'detail-history/:id'
				},
				// ============== settings ==============
				{
					title: 'Settings',
					stateRef: 'settings'
				},
				// ============== HMI ==============
				{
					title: 'HMI',
					stateRef: 'hmi'
				},
				// ============== settings ==============
				{
					title: 'Stats',
					stateRef: 'stats'
				},
				// ===================================
				{
					title: '404 Page',
					fixedHref: '404.html',
					blank: true
				}
			]
		});
	}

})();
