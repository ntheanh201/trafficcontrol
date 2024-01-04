/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 *@typedef ServerCapability
 * @property {string} name
 * @property {string} description
 * @property {string} lastUpdated
 */

/**
 * @param {ServerCapability[]} serverCapabilities
 * @param {*} $scope
 * @param {*} $state
 * @param {import("../../../service/utils/angular.ui.bootstrap").IModalService} $uibModal
 * @param {import("../../../service/utils/LocationUtils")} locationUtils
 * @param {import("../../../api/ServerCapabilityService")} serverCapabilityService
 * @param {import("../../../models/MessageModel")} messageModel
 */
var TableServerCapabilitiesController = function (serverCapabilities, $scope, $state, $uibModal, locationUtils, serverCapabilityService, messageModel) {

    /**** Constants, scope data, etc. ****/

    /** The columns of the ag-grid table */
    $scope.columns = [
        {
            headerName: "Name",
            field: "name",
            hide: false,
        },
        {
            headerName: "Description",
            field: "description",
            hide: false,
        },
        {
            headerName: "Last Updated",
            field: "lastUpdated",
            hide: true,
            filter: "agDateColumnFilter",
        },
    ]

    /** @type {import("../agGrid/CommonGridController").CGC.DropDownOption[]} */
    $scope.dropDownOptions = [{
        name: "createServerCapabilityMenuItem",
        href: "#!/server-capabilities/new",
        text: "Create New Server Capability",
        type: 2
    }]

    /** Reloads all resolved data for the view. */
    $scope.refresh = function () {
        $state.reload();
    };

    function deleteServerCapability(serverCapability) {
        serverCapabilityService.deleteServerCapability(serverCapability.name)
            .then(function (result) {
                messageModel.setMessages(result.data.alerts, false);
                $scope.refresh();
            });
    };

    function confirmDelete(serverCapability) {
        const params = {
            title: 'Delete Server Capability: ' + serverCapability.name,
            key: serverCapability.name
        };
        const modalInstance = $uibModal.open({
            templateUrl: 'common/modules/dialog/delete/dialog.delete.tpl.html',
            controller: 'DialogDeleteController',
            size: 'md',
            resolve: {params}
        });
        modalInstance.result.then(function () {
            deleteServerCapability(serverCapability);
        });
    };

    /** @type {import("../agGrid/CommonGridController").CGC.ContextMenuOption[]} */
    $scope.contextMenuOptions = [
        {
            getHref: serverCapability => `#!/server-capabilities/edit?name=${serverCapability.name}`,
            getText: serverCapability => `Open ${serverCapability.name} in a new tab`,
            newTab: true,
            type: 2
        },
        {type: 0},
        {
            getHref: serverCapability => `#!/server-capabilities/edit?name=${serverCapability.name}`,
            text: "Edit",
            type: 2
        },
        {
            onClick: serverCapability => confirmDelete(serverCapability),
            text: "Delete",
            type: 1
        },
        {type: 0},
        {
            getHref: serverCapability => `#!/server-capabilities/delivery-services?name=${serverCapability.name}`,
            text: "View Delivery Services",
            type: 2
        },
        {
            getHref: serverCapability => `#!/server-capabilities/servers?name=${serverCapability.name}`,
            text: "Manage Servers",
            type: 2
        }
    ]

    /** Options, configuration, data and callbacks for the ag-grid table. */
    /** @type {import("../agGrid/CommonGridController").CGC.GridSettings} */
    $scope.gridOptions = {
        onRowClick: function (row) {
            locationUtils.navigateToPath(`/server-capabilities/edit?name=${row.data.name}`);
        }
    };

    $scope.defaultData = {
        description: "",
        name: ""
    };

    $scope.serverCapabilities = serverCapabilities.map(
        serverCapability => ({
            ...serverCapability,
            lastUpdated: new Date(serverCapability.lastUpdated.replace(" ", "T").replace("+00", "Z"))
        })
    );
};

TableServerCapabilitiesController.$inject = ['serverCapabilities', '$scope', '$state', '$uibModal', 'locationUtils', 'serverCapabilityService', 'messageModel'];
module.exports = TableServerCapabilitiesController;
