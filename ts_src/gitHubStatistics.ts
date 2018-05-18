/// <reference path="../node_modules/@types/jquery/index.d.ts" />
// npm install --save @types/jquery

namespace GitHubStatistics {    
    export interface RepoStatsJSON {
        DateStatCreatedUTC: string;
        Repository: string;
        LatestAssetUrl: string;
        LatestReleaseCreationDate: string;
        LatestReleaseTagName: string;
        LatestReleaseDownloadCount: number;
        AllReleasesDownloadCount: number;
        TotalDownloadCount: number;
    }

    export class LDAPCPStats {
        url: string = "https://ldapcp-functions.azurewebsites.net/api/GetLatestLDAPCPRepoStats";
        authZKey: string = "Qa9dKSDOyvgxsbsnJvw9pwTQ3PrGa6J/caQA8RF4tfiz9woaTmeaXQ==";
        getLatestStat() {
            //console.log("Sending query to " + this.url);            
            $.ajax({
                method: "GET",
                crossDomain: true,
                data: {code: this.authZKey},
                dataType: "jsonp",
                jsonpCallback: "GitHubStatistics.LDAPCPStats.parseGitHubStatisticsResponse",
                url: this.url,
                success: function(responseData, textStatus, jqXHR) {
                },
                error: function (responseData, textStatus, errorThrown) {
                    console.log("Request to " + this.url + " failed: " + errorThrown);
                }
            });
        }

        static decodeJSONResponse(json: GitHubStatistics.RepoStatsJSON) {
            var obj = Object.assign({}, json, {
                //created: new Date(json.DateStatCreatedUTC)
            });
            return obj;
        }

        static parseGitHubStatisticsResponse (data) {
            var result =  GitHubStatistics.LDAPCPStats.decodeJSONResponse(data);
            $("#TotalDownloadCount").text(result.TotalDownloadCount);
            $("#LatestReleaseDownloadCount").text(result.LatestReleaseDownloadCount);
            $("#LatestReleaseTagName").text(result.LatestReleaseTagName);
            $("#LatestAssetUrl").attr("href", result.LatestAssetUrl)
            //$("#LatestReleaseCreationDate").text(result.LatestReleaseCreationDate);
        };
    }
}

$(document).ready(function () {
    let stats = new GitHubStatistics.LDAPCPStats();
    let result = stats.getLatestStat()
});

