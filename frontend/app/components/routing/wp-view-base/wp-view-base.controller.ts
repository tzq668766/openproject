//-- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
//++

import {WorkPackageResourceInterface} from '../../api/api-v3/hal-resources/work-package-resource.service';
import {scopedObservable} from '../../../helpers/angular-rx-utils';
import {WorkPackageCacheService} from '../../work-packages/work-package-cache.service';
import {KeepTabService} from '../../wp-panels/keep-tab/keep-tab.service';
import {wpControllersModule} from '../../../angular-modules';
import {WorkPackageEditModeStateService} from '../../wp-edit/wp-edit-mode-state.service';

export class WorkPackageViewController {

  protected $q:ng.IQService;
  protected $state:ng.ui.IStateService;
  protected $rootScope:ng.IRootScopeService;
  protected keepTab:KeepTabService;
  protected wpCacheService:WorkPackageCacheService;
  protected wpEditModeState:WorkPackageEditModeStateService;
  protected WorkPackageService;
  protected PathHelper:op.PathHelper;
  protected I18n:op.I18n;

  // Helper promise to detect when the controller has been initialized
  // (when a WP has loaded).
  public initialized:ng.IDeferred<any>;

  // Static texts
  public text:any = {};

  // Work package resource to be loaded from the cache
  public workPackage:WorkPackageResourceInterface;
  public projectIdentifier:string;

  protected focusAnchorLabel:string;
  public showStaticPagePath:string;

  constructor(public $injector, public $scope, protected workPackageId) {
    this.$inject('$q', '$state', 'keepTab', 'wpCacheService', 'WorkPackageService',
                 'wpEditModeState', 'PathHelper', 'I18n');

    this.initialized = this.$q.defer();
    this.initializeTexts();
  }

  /**
   * Observe changes of work package and re-run initialization.
   * Needs to be run explicitly by descendants.
   */
  protected observeWorkPackage() {
    this.wpCacheService.loadWorkPackage(this.workPackageId).observeOnScope(this.$scope)
      .subscribe((wp:WorkPackageResourceInterface) => {
        this.workPackage = wp;
        this.init();
        this.initialized.resolve();
      });
  }

  protected $inject(...args:string[]) {
    args.forEach(field => {
      this[field] = this.$injector.get(field);
    });
  }

  /**
   * Provide static translations
   */
  protected initializeTexts() {
    this.text.tabs = {};
    ['overview', 'activity', 'relations', 'watchers'].forEach(tab => {
      this.text.tabs[tab] = this.I18n.t('js.work_packages.tabs.' + tab);
    });
  }

  /**
   * Initialize controller after workPackage resource has been loaded.
   */
  protected init() {
    // Set elements
    this.workPackage.project.$load().then(() => {
      this.projectIdentifier = this.workPackage.project.identifier;
    });

    // Preselect this work package for future list operations
    this.showStaticPagePath = this.PathHelper.workPackagePath(this.workPackage);
    this.WorkPackageService.cache().put('preselectedWorkPackageId', this.workPackage.id);

    // Listen to tab changes to update the tab label
    scopedObservable(this.$scope, this.keepTab.observable).subscribe((tabs:any) => {
      this.updateFocusAnchorLabel(tabs.active);
    });
  }

  /**
   * Recompute the current tab focus label
   */
  public updateFocusAnchorLabel(tabName:string):string {
    const tabLabel = this.I18n.t('js.label_work_package_details_you_are_here', {
      tab: this.I18n.t('js.work_packages.tabs.' + tabName),
      type: this.workPackage.type.name,
      subject: this.workPackage.subject
    });

    return this.focusAnchorLabel = tabLabel;
  }

  public canViewWorkPackageWatchers() {
    return !!(this.workPackage && this.workPackage.watchers);
  }
}

wpControllersModule.controller('WorkPackageViewController', WorkPackageViewController);
