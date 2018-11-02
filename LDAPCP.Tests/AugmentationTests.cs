﻿using ldapcp;
using NUnit.Framework;
using System;

namespace LDAPCP.Tests
{
    [TestFixture]
    [Parallelizable(ParallelScope.Children)]
    public class AugmentationTests
    {
        private LDAPCPConfig Config;
        private LDAPCPConfig BackupConfig;

        [OneTimeSetUp]
        public void Init()
        {
            Console.WriteLine($"Starting augmentation test {TestContext.CurrentContext.Test.Name}...");
            Config = LDAPCPConfig.GetConfiguration(UnitTestsHelper.ClaimsProviderConfigName, UnitTestsHelper.SPTrust.Name);
            BackupConfig = Config.CopyPersistedProperties();
            Config.EnableAugmentation = true;
            Config.MainGroupClaimType = ClaimsProviderConstants.DefaultMainGroupClaimType;
            foreach (LDAPConnection ldapConn in Config.LDAPConnectionsProp)
            {
                ldapConn.AugmentationEnabled = true;
                ldapConn.GetGroupMembershipAsADDomainProp = true;
            }
            Config.Update();
        }

        [OneTimeTearDown]
        public void Cleanup()
        {
            Config.ApplyConfiguration(BackupConfig);
            Config.Update();
            Console.WriteLine($"Restored actual configuration.");
        }

        [Test, TestCaseSource(typeof(ValidateEntityDataSource), "GetTestData")]
        [Repeat(UnitTestsHelper.TestRepeatCount)]
        public void AugmentEntity(ValidateEntityData registrationData)
        {
            UnitTestsHelper.TestAugmentationOperation(UnitTestsHelper.SPTrust.IdentityClaimTypeInformation.MappedClaimType, registrationData.ClaimValue, registrationData.IsMemberOfTrustedGroup);
        }

        [TestCase("yvand@contoso.local", true)]
        [TestCase("zzzyvand@contoso.local", false)]
        public void DEBUG_AugmentEntity(string claimValue, bool isMemberOfTrustedGroup)
        {
            LDAPConnection coco = new LDAPConnection();
            coco.AugmentationEnabled = true;
            coco.GetGroupMembershipAsADDomainProp = false;
            coco.UserServerDirectoryEntry = false;
            coco.Path = "LDAP://test";
            coco.Username = "userTest";
            Config.LDAPConnectionsProp.Add(coco);
            Config.Update();
            UnitTestsHelper.TestAugmentationOperation(UnitTestsHelper.SPTrust.IdentityClaimTypeInformation.MappedClaimType, claimValue, isMemberOfTrustedGroup);
        }
    }
}
