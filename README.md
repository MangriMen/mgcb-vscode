## Prerequisites

Install and set up the MGCB Editor. [If you have dotnet installed][1]:

### Accessing MGCB and MCGB Editor without a global tool

MGCB Editor is no longer a .NET global tool, and doesn't need to be installed or registered.

However, if you are migrating from 3.8.0, you will need to setup a configuration file. Next to your `.csproj`, create a folder nammed `.config` and a file within it nammed `dotnet-tools.json` with this content:

```json
{
  "version": 1,
  "isRoot": true,
  "tools": {
    "dotnet-mgcb": {
      "version": "3.8.1.263",
      "commands": ["mgcb"]
    },
    "dotnet-mgcb-editor": {
      "version": "3.8.1.263",
      "commands": ["mgcb-editor"]
    },
    "dotnet-mgcb-editor-linux": {
      "version": "3.8.1.263",
      "commands": ["mgcb-editor-linux"]
    },
    "dotnet-mgcb-editor-windows": {
      "version": "3.8.1.263",
      "commands": ["mgcb-editor-windows"]
    },
    "dotnet-mgcb-editor-mac": {
      "version": "3.8.1.263",
      "commands": ["mgcb-editor-mac"]
    }
  }
}
```

Please note that you can't use the `3.8.1.*` wildcard in the `dotnet-tools.json` file (tool versions have to be fully qualified). We strongly recommand that the versions match the MonoGame version referenced in your `.csproj` (if you're using the `*` wildcard, make sure that they don't end up mismatching if the nugets are updated without you noticing).

You will also need to add this to your `.csproj`:

```xml
<Target Name="RestoreDotnetTools" BeforeTargets="Restore">
  <Message Text="Restoring dotnet tools" Importance="High" />
  <Exec Command="dotnet tool restore" />
</Target>
```

If you need old global version of MGCB editor

```sh
dotnet tool install --global dotnet-mgcb-editor
mgcb-editor --register
```

Note: If you are using the older versions of the editor, then you need to update
its path in the project's setting accordingly.

[1]: https://docs.monogame.net/articles/getting_started/1_setting_up_your_development_environment_ubuntu.html#install-mgcb-editor
