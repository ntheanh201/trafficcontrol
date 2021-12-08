package orttest

/*
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// TrafficServerOwner is the name of the user that owns the ATS process and
// configuration directory/files.
const TrafficServerOwner = "ats"

// DefaultCacheHostName should be used to set the hostname of the cache server
// running t3c for the tests, wherever applicable (and where the hostname is not
// part of what's under test).
const DefaultCacheHostName = `atlanta-edge-03`

// BaselineConfigDir is the name of the directory (local to the tests dir) where
// configuration files as they ought to be written by a "badass" run given the
// testing configuration in the fixtures data can be found.
const BaselineConfigDir = "baseline-configs"

// TestConfigDir is the absolute path to the directory where the tests output
// written configuration files when t3c is called.
const TestConfigDir = "/opt/trafficserver/etc/trafficserver"

// RecordsConfigFileName is the full path to the records.config ATS
// configuration file written by t3c when called by the tests.
const RecordsConfigFileName = TestConfigDir + "/records.config"

// CMDUpdateStatus is the string passed to the --get-data option of t3c request
// to obtain a server's "update pending" status.
const CMDUpdateStatus = `update-status`

// TestFiles is the list of ATS configuration files that should be compared
// between a baseline static contents and the output generated by t3c.
var TestFiles = [8]string{
	"astats.config",
	"hdr_rw_first_ds-top.config",
	"hosting.config",
	"parent.config",
	"records.config",
	"remap.config",
	"storage.config",
	"volume.config",
}