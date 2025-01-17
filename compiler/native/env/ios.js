/*
 * This file is part of NectarJS
 * Copyright (c) 2020 Adrien THIERRY
 * http://nectarjs.com - https://nectrium.com
 *
 * sources : https://github.com/nectarjs/nectarjs
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var os = require("os");

var IOS =
{
    name: "ios",
    main: "ios.hpp",
    compiler: "xcodebuild",
    stdlib: [{bind: "Nectar", module: "iOS"}, "console", "Object", "Math", "JSON" ],
    check: 
    {
        "env": 
        {
            "es6": true
        },
        "extends": "eslint:recommended",
        "rules": 
        {
            "strict": "global",
            "no-console": "off",
            "indent": "off",
            "linebreak-style": "off",
            "semi": [
                "warn",
                "always"
            ],
            "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
            "no-undef": "error",
            "no-redeclare": ["error", { "builtinGlobals": false }],
        },
        "globals":
        {
            "__njs_typeof": false,
            "Nectar": false,
            "console": false,
            "module": false,
            "require": false,
            "__NJS_Log_Console": false,
            "__NJS_Object_Keys": false,
            "__NJS_Object_Stringify": false,
            "__NJS_Call_Function": false,
            "__NJS_ARGS": false,
            "__NJS_ENV": false,
            "__NJS_PLATFORM": false,
            "JSON": false,
            "Object": false,
        },
    },
    out: function(_name)
    {
        return _name + ".app";
    },
    init: function(_folder)
    {
        copyDirSync(path.join(COMPILER.MAIN_PATH, "platform", "ios"), _folder, true);
    },
    write: function(code)
    {
        fs.writeFileSync(path.join(COMPILER.TMP_FOLDER, "ios.hpp"), code);
    },
    post: function()
    {
        try 
		{
            fs.mkdirSync(COMPILER.OUT);
        }
        catch(e){}
        copyDirSync (`${COMPILER.TMP_FOLDER}/build/NectarIOS.app`, COMPILER.OUT, true);
    },
    run: function()
    {
        var device;
        if(CLI.cli["--target"]) device = '--devicetypeid \'' + CLI.cli["--target"].argument + '\'';
        else 
        {
            console.log('Please, specify a target with --run on ios env');
            process.exit(1);
        }
        var runit = 'ios-sim launch ' + COMPILER.OUT + ' ' + device ;
        
        try 
		{
            child_process.execSync(runit);
        }
        catch(e){}
    },
	prepare: function(_folder)
	{
		var _www = path.join(path.resolve(path.dirname(COMPILER.IN)), "www");
		if(fs.existsSync(_www))
		{
			copyDirSync(_www, path.join(_folder, "NectarIOS", "raw"), true);
		}
		
		return path.join(_folder, "NectarIOS");
	},
    cli: function(compiler, preset, out, _in, option)
    {
        var device = '';
        if(CLI.cli["--target"])
        {
            var info = CLI.cli["--target"].argument.split(", ");
            device = '-destination \'platform=iOS Simulator,name=' + info[0].split("-").join(" ") + ',OS=' + info[1] + '\'';
        }
        else device = '-destination generic/platform=iOS';
        return `${compiler} build -scheme NectarIOS ${device} CONFIGURATION_BUILD_DIR="${COMPILER.TMP_FOLDER}/build/" CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO CODE_SIGN_ENTITLEMENTS="" CODE_SIGNING_ALLOWED="NO"`;
    }

}

module.exports = IOS;
