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
import {browser, by, element, ExpectedConditions} from 'protractor';

import {randomize} from '../config';
import {SideNavigationPage} from "./SideNavigationPage.po";

export class ServerCapabilitiesPage extends SideNavigationPage {
    private btnCreateServerCapabilities = element(by.name('createServerCapabilityButton'));
    private txtSCName = element(by.id("name"))
    private txtSCDescription = element(by.id("description"))
    private searchFilter = element(by.id('serverCapabilitiesTable_filter')).element(by.css('label input'));
    private btnDelete = element(by.buttonText('Delete'))
    private txtConfirmCapabilitiesName = element(by.name('confirmWithNameInput'));
    private randomize = randomize;


    public async OpenServerCapabilityPage() {
        await this.NavigateToServerCapabilitiesPage();
    }

    public async OpenConfigureMenu() {
        await this.ClickConfigureMenu();
    }

    public async CreateCreate() {

    }

    public async CreateServerCapabilities(nameSC: string, descriptionSC: string, outputMessage: string) {
        await this.OpenServerCapabilityPage();
        await element(by.buttonText("More")).click();
        await element(by.linkText("Create New Server Capability")).click();

        let result = false
        let name = nameSC + this.randomize;
        await this.btnCreateServerCapabilities.click();
        if (name != this.randomize) {
            await this.txtSCName.sendKeys(name);
        }
        await this.txtSCDescription.sendKeys(descriptionSC);
        if (outputMessage == await (this.GetBlankErrorMessage()) || outputMessage == await (this.GetSyntaxErrorMessage())) {
            await this.NavigateToServerCapabilitiesPage();
            result = true;
        } else {
            await this.ClickCreate();
            if ((await this.GetOutputMessage()) == outputMessage) {
                result = true;
            } else if ((await this.GetOutputMessage()).includes(' already exists.') || (await this.GetOutputMessage()).includes('Forbidden')) {
                await this.NavigateToServerCapabilitiesPage();
                result = true;
            } else {
                result = false;
            }
        }
        return result;
    }


    public async SearchServerCapabilities(nameSC: string) {
        let name = nameSC + this.randomize;
        await this.searchFilter.clear();
        await this.searchFilter.sendKeys(name);
        await element.all(by.repeater('sc in ::serverCapabilities')).filter(function (row) {
            return row.element(by.name('name')).getText().then(function (val) {
                return val === name;
            });
        }).first().click();
    }

    public async DeleteServerCapabilities(nameSC: string, outputMessage: string) {
        let result = false;
        let name = nameSC + this.randomize;
        await this.btnDelete.click();
        await browser.wait(ExpectedConditions.visibilityOf(this.txtConfirmCapabilitiesName), 1000);
        await this.txtConfirmCapabilitiesName.sendKeys(name);
        if (await this.ClickDeletePermanently() == true) {
            result = await this.GetOutputMessage().then(function (value) {
                if (outputMessage == value) {
                    return true;
                } else {
                    return false;
                }
            })
        } else {
            await this.ClickCancel();
        }
        return result;
    }
}
