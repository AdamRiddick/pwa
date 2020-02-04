#addin nuget:?package=Cake.FileHelpers&version=3.2.0
#addin nuget:?package=Cake.Webpack&version=0.3.0

var environment = Argument("environment", "Development");
var target = Argument("target", "Default");

Task("BuildPWA")
    .Does(() =>
    {
        Information("Building PWA ...");

        var distPath = MakeAbsolute(File("./proxy/wwwroot/dist")).FullPath;
        if (DirectoryExists(distPath))
        {
            DeleteDirectory(distPath, new DeleteDirectorySettings { 
                Force = true,
                Recursive = true
            });
        }

        Webpack.FromPath("./proxy/wwwroot/src")
            .Global(settings => {
                settings.WithBuildMode(WebpackBuildMode.Development);
                settings.WithArguments($"--env.mode {environment} --env.presets serviceworker --verbose");
            });

        Information("PWA Complete.");
    });

Task("BuildPWAProxy")
    .Does(() =>
    {
        Information("Building PWA Proxy ...");

        var proxySolutionPath = MakeAbsolute(File("./proxy/proxy.sln")).FullPath;
        DotNetCoreClean(proxySolutionPath);
        NuGetRestore(proxySolutionPath);
        DotNetCoreBuild(proxySolutionPath);

        var configuration = environment == "Development" ? "Debug" : "Release";
        var publishDirectory = MakeAbsolute(File($"./proxy/bin/{configuration}")).FullPath;

        if (DirectoryExists(publishDirectory))
        {
            DeleteDirectory(publishDirectory, new DeleteDirectorySettings { 
                Force = true,
                Recursive = true
            });
        }
        
        var publishSettings = new DotNetCorePublishSettings
        {
            Framework = "netcoreapp3.1",
            Configuration = configuration,
            OutputDirectory = publishDirectory
        };
        DotNetCorePublish(proxySolutionPath, publishSettings);
        
        var proxyProjectPath = MakeAbsolute(File("./proxy/proxy.csproj")).FullPath;
        DotNetCoreRun(proxyProjectPath);
        Information("PWA Proxy Complete.");
    });

Task("Default")
    .IsDependentOn("BuildPwa")
    .IsDependentOn("BuildPWAProxy")
    .Does(() =>
    {
        Information("Build Complete.");
    });

Information("Starting Build ...");
RunTarget(target);