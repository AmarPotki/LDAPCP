/// <reference path="../node_modules/@types/jquery/index.d.ts" />
// npm install --save @types/jquery
var GitHubStatistics;
(function (GitHubStatistics) {
    class LDAPCPStats {
        constructor() {
            this.url = "https://github-stats.azurewebsites.net/api/GetLatestDocument";
        }
        getLatestStat() {
            //console.log("Sending query to " + this.url);            
            $.ajax({
                method: "GET",
                crossDomain: true,
                data: { project: "Yvand/LDAPCP" },
                dataType: "jsonp",
                jsonpCallback: "GitHubStatistics.LDAPCPStats.parseGitHubStatisticsResponse",
                url: this.url,
                success: function (responseData, textStatus, jqXHR) {
                },
                error: function (responseData, textStatus, errorThrown) {
                    console.log("Request to " + this.url + " failed: " + errorThrown);
                }
            });
        }
        static decodeJSONResponse(json) {
            var obj = Object.assign({}, json, {});
            return obj;
        }
        static parseGitHubStatisticsResponse(data) {
            var result = GitHubStatistics.LDAPCPStats.decodeJSONResponse(data);
            $("#TotalDownloadCount").text(result.TotalDownloadCount);
            $("#LatestReleaseDownloadCount").text(result.LatestReleaseDownloadCount);
            $("#LatestReleaseTagName").text(result.LatestReleaseTagName);
            $("#LatestAssetUrl").attr("href", result.LatestAssetUrl);
            //$("#LatestReleaseCreationDate").text(result.LatestReleaseCreationDate);
        }
        ;
    }
    GitHubStatistics.LDAPCPStats = LDAPCPStats;
})(GitHubStatistics || (GitHubStatistics = {}));
$(document).ready(function () {
    let stats = new GitHubStatistics.LDAPCPStats();
    let result = stats.getLatestStat();
});
