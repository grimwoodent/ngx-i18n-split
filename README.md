# ngx-i18n-split

Split i18n combined json files for lazy loading components

Add an `split` script to your project's `package.json`:

```
"scripts": {
  "split": "ngx-i18n-split -i ./src/i18n/*.json -o .src/assets/i18n/*.json -k extractedKey -d defaultFolder"
}
```

You can now run `npm run split` to combine files.

## CLI
```
Usage:
ngx-i18n-combine [options]

Options:
--version, -v       Show version number 
                    [boolean]

--help, -h          Show help 
                    [boolean]

--input, -i         Paths you would like to split files from. You can use
                    path expansion, glob patterns and multiple paths
                    [array] 
                    [default: current working path]

--output, -o        Paths where you would like to save files.
                    [array] 
                    [required]
         
--keys, -k          Keys which must be extracted from files.
                    [array] 
                    [required]
                                                                               
--defaultFolder, -d Folder for keys which mustn't br extracted.
                    [string]
                    [default: ""]
                    
--indent, -it       Output format indentation
                    [string]
                    [default: "\t"]

--sort, -s          Sort strings in alphabetical order when saving 
                    [boolean] 
                    [default: false]

--minify, -m        Minify strings in output files 
                    [boolean] 
                    [default: false]

--verbose, -vb      If true, prints all processed file paths to console 
                    [boolean] 
                    [default: true]
                    
--watch, -w         Watch changes
                    [boolean] 
                    [default: false]