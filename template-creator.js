const fs = require('fs');

fs.readFile( './alopeyk.build.json', function (err, data) {
    if (err) {
      throw err; 
    }
    const jsonContent = JSON.parse(data);
    let srcFile = Object.keys(jsonContent.templates)[0];
    let targetFile = jsonContent.templates[srcFile];
    let finalObj = {};

    fs.readFile( './build_scripts/local-variable.sh', function( err, data ){
        for( let item of jsonContent.variables )
        {
            fileContext = data.toString();
            const regex = new RegExp("(?=" + item.toString() + ")(.*)");
            let fetchedData = regex.exec( fileContext );
            nextRegex = /=(.*)/g;
            fetchedData = nextRegex.exec( fetchedData[0].trim() );
            finalObj[item] = fetchedData[0].replace("=", "");
        }

        fs.createReadStream( srcFile ).pipe(fs.createWriteStream( targetFile ));
        
        fs.readFile( targetFile, function( err, data ){
            fileContext = data.toString();
            
            jsonContent.variables.map( item => {
                fileContext = fileContext.replace( '<' + item.trim() + '>', finalObj[item]);
            });

            fs.writeFile( targetFile, fileContext, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            }); 

        });
    });

  });


  