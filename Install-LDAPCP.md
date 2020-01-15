## How to install LDAPCP

> **Important:**  
> Start a **new PowerShell console** to ensure the use of up to date persisted objects, which avoids concurrency update errors.  
> If something goes wrong, [check this page](Fix-setup-issues.html) to fix issues.

- Download LDAPCP.wsp.
- Install and deploy the solution:

```powershell
Add-SPSolution -LiteralPath "F:\Data\Dev\LDAPCP.wsp"
Install-SPSolution -Identity "LDAPCP.wsp" -GACDeployment
```

- Associate LDAPCP with a SPTrustedIdentityTokenIssuer:

```powershell
$trust = Get-SPTrustedIdentityTokenIssuer "SPTRUST NAME"
$trust.ClaimProviderName = "LDAPCP"
$trust.Update()
```

- Visit central administration > System Settings > Manage farm solutions: Wait until solution status shows "Deployed".
- Update assembly manually on SharePoint servers that do not run the service "Microsoft SharePoint Foundation Web Application" (see below for more details).
- Restart IIS service and SharePoint timer service on each SharePoint server.
- [Configure](Configure-LDAPCP.html) LDAPCP for your environment.

## Important

- Due to limitations of SharePoint API, do not associate LDAPCP with more than 1 SPTrustedIdentityTokenIssuer. Developers can [bypass this limitation](For-Developers.html).

- You must manually install ldapcp.dll in the GAC of SharePoint servers that do not run SharePoint service "Microsoft SharePoint Foundation Web Application".

You can extract ldapcp.dll from LDAPCP.wsp using [7-zip](https://www.7-zip.org/), and install it in the GAC using this PowerShell script:

```powershell
[System.Reflection.Assembly]::Load("System.EnterpriseServices, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a") | Out-Null
$publish = New-Object System.EnterpriseServices.Internal.Publish

try
{
    # Method Publish.GacRemove() removes the assembly from the GAC if it exists (for update scenarios)
    $existingAssembly = [System.Reflection.Assembly]::Load("ldapcp, Version=1.0.0.0, Culture=neutral, PublicKeyToken=80be731bc1a1a740").Location
    $publish.GacRemove($existingAssembly)
    Write-Host "Assembly $existingAssembly successfully removed."
} catch {}

# Adds assembly to the GAC
$publish.GacInstall("F:\Data\Dev\ldapcp.dll")
Write-Host "Assembly was successfully added to the GAC."
```
