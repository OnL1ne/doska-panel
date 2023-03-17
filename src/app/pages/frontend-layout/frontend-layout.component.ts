import {Component, HostListener, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {PermissionsService} from "../../services/permissions.service";
import {faCog, faSignal, faUniversity, faUserCircle, faGavel,
        faFileAlt, faClipboardList, faAddressCard, faUserFriends,
        faChartBar, faTasks, faBriefcase, faUserShield} from '@fortawesome/free-solid-svg-icons';

const dashboardCategory = 'panel.category.main_dashboard';
const settingsCategory = 'panel.category.main_settings';

export interface Category {
  title: string,
  active: boolean,
}

@Component({
  selector: 'app-frontend-layout',
  templateUrl: './frontend-layout.component.html',
  styleUrls: ['./frontend-layout.component.scss']
})
export class FrontendLayoutComponent implements OnInit {
  public mainCategory: Category = {
    title: dashboardCategory,
    active: true,
  };
  private faCog = faCog;
  private faSignal = faSignal;
  private faUniversity = faUniversity;
  private faUserCircle = faUserCircle;
  private faGavel = faGavel;
  private faUserShield = faUserShield;
  private faFileAlt = faFileAlt;
  private faClipboardList = faClipboardList;
  private faAddressCard = faAddressCard;
  private faUserFriends = faUserFriends;
  private faChartBar = faChartBar;
  private faTasks = faTasks;
  private faBriefcase = faBriefcase;

  public subCategory: Category = {
    title: 'panel.subcategory.dashboard',
    active: true,
  };

  public categories = [
    {
      title: dashboardCategory,
      active: true,
      image: '/assets/image/statistics_active.png',
      class: 'main_dashboard-menu',
      icon: this.faSignal,
      link: this.auth.getUserDetails().role_name === 'admin' ? '/users' : '/',
      subTitle: this.auth.getUserDetails().role_name === 'admin' ? 'panel.subcategory.users_management' : 'panel.subcategory.dashboard',
    },
    {
      title: settingsCategory,
      active: false,
      image: '/assets/image/settings_active.png',
      class: 'main_settings-menu',
      icon: this.faCog,
      link: this.auth.getUserDetails().role_name === 'admin' ? '/licenses' : '/profile',
      subTitle: this.auth.getUserDetails().role_name === 'admin' ? 'panel.subcategory.licenses_management' : 'panel.subcategory.account_settings',
    },
  ];

  public subCategories = [
    {
      category: dashboardCategory,
      title: 'panel.subcategory.dashboard',
      image: '/assets/image/dashboard.png',
      link: '/',
      permission: this.permission.checkPermission(this.permission.PERMISSION_VIEW_TOTAL_STATISTICS),
      active: true,
      icon: this.faChartBar,
    },
    {
      category: dashboardCategory,
      title: 'panel.subcategory.users_management',
      image: '/assets/image/dashboard.png',
      link: '/users',
      permission: this.permission.checkPermission(this.permission.PERMISSION_VIEW_USERS_LIST),
      active: false,
      icon: this.faUserFriends,
    },
    {
      category: dashboardCategory,
      title: 'panel.subcategory.trainings_management',
      image: '/assets/image/dashboard.png',
      link: '/trainings',
      permission: this.permission.checkPermission(this.permission.PERMISSION_VIEW_TRAININGS_LIST),
      active: false,
      icon: this.faTasks,
    },
    {
      category: dashboardCategory,
      title: 'panel.subcategory.companies_management',
      image: '/assets/image/dashboard.png',
      link: '/companies',
      permission: this.permission.checkPermission(this.permission.PERMISSION_VIEW_COMPANIES_LIST),
      active: false,
      icon: this.faBriefcase,
    },
    {
      category: settingsCategory,
      title: 'panel.subcategory.licenses_management',
      image: '/assets/image/dashboard.png',
      link: '/licenses',
      permission: this.permission.checkPermission(this.permission.PERMISSION_VIEW_LICENSES_LIST),
      active: false,
      icon: this.faUniversity,
    },
    {
      category: settingsCategory,
      title: 'panel.subcategory.account_settings',
      image: '/assets/image/dashboard.png',
      link: '/profile',
      permission: true,
      active: false,
      icon: this.faUserCircle,
    },
    {
      category: settingsCategory,
      title: 'panel.subcategory.terms_and_conditions',
      image: '/assets/image/dashboard.png',
      link: '/terms',
      permission: this.permission.checkPermission(this.permission.PERMISSION_VIEW_AGREEMENTS),
      active: false,
      icon: this.faFileAlt,
    },
    {
      category: settingsCategory,
      title: 'panel.subcategory.privacy_policy',
      image: '/assets/image/dashboard.png',
      link: '/privacy',
      permission: this.permission.checkPermission(this.permission.PERMISSION_VIEW_AGREEMENTS),
      active: false,
      icon: this.faUserShield,
    },
    {
      category: settingsCategory,
      title: 'panel.subcategory.audit',
      image: '/assets/image/dashboard.png',
      link: '/activity_log',
      permission: this.permission.checkPermission(this.permission.PERMISSION_VIEW_COMPANIES_LIST),
      active: false,
      icon: this.faClipboardList,
    },
  ];

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private permission: PermissionsService,
  ) {}

  ngOnInit() {
    this.initMenu();
  }

  public initMenu() {
    if (localStorage.getItem('mainCategoryTitle')) {
      this.mainCategory.title = localStorage.getItem('mainCategoryTitle');
    }
    if (localStorage.getItem('subCategoryTitle')) {
      this.subCategory.title = localStorage.getItem('subCategoryTitle');
    }
  }

  @HostListener('document:click', ['$event'])
  public closeBurgerMenu(): void {
    if (this.auth.getBurgerMenu) this.auth.burgerMenuToggle();
  }

  public fromLogo() {
    this.mainCategory.title = dashboardCategory;
    this.subCategory.title = 'panel.subcategory.dashboard';
    this.setMainCategoryTitle(this.mainCategory.title);
    this.setSubCategoryTitle(this.subCategory.title);
  }

  public changeMainCategory(title:string, subTitle:string):void {
    this.mainCategory.title = title;
    this.subCategory.title = subTitle;
    this.setMainCategoryTitle(this.mainCategory.title);
    this.setSubCategoryTitle(this.subCategory.title);
  }

  public changeSubCategory(title:string):void {
    this.subCategory.title = title;
    this.setSubCategoryTitle(this.subCategory.title);
    this.auth.burgerMenuToggle();
  }

  public filterSubCategory(category:string) {
    return this.subCategories.filter(x => x.category == category);
  }

  public setMainCategoryTitle(title: string): void {
    localStorage.setItem('mainCategoryTitle', title);
  }

  public setSubCategoryTitle(title: string): void {
    localStorage.setItem('subCategoryTitle', title);
  }
}
