const $ = require('jquery');
const electron = require('electron').remote;
const dialog = electron.dialog;
const fsp = require('fs').promises;
// let fs = require('fs');
$(document).ready(function(){
    let rows = [];
    let lso;

    function getdefaultcell(){
        let cell = {
            val: '',
            fontFamily: 'Georgia',
            fontSize: 10,
            bold: false,
            italic: false,
            underline: false,
            bgcolor: '#FFFFFF',
            textcolor: '#000000',
            Valign: 'middle',
            halign: 'left',
            formula: '',
            upstream: [],
            downstream: []
        };
        
        return cell;

    }

    function preparecelldiv(cdiv, cobj){
        $(cdiv).html(cobj.val);
        $(cdiv).css('font-family', cobj.fontFamily);
        $(cdiv).css('font-size', cobj.fontSize + 'px');
        $(cdiv).css('font-weight', cobj.bold? 'bold': 'normal');
        $(cdiv).css('font-style', cobj.italic? 'italic': 'normal');
        $(cdiv).css('text-decoration', cobj.underline? 'underline': 'none');
        $(cdiv).css('background-color', cobj.bgcolor);
        $(cdiv).css('color', cobj.textcolor);
        $(cdiv).css('text-align', cobj.halign);
    }

    $('#content-container').on('scroll',function(){
        $('#first-row').css('top', $('#content-container').scrollTop());
        $('#first-col').css('left', $('#content-container').scrollLeft());
        $('#tl-cell').css('top', $('#content-container').scrollTop());
        $('#tl-cell').css('left', $('#content-container').scrollLeft());
    });


$('#new').on('click', function(){
    rows = []; /// ???????????? how this resolved
    $('#grid').find('.row').each(function(){
        let cells = [];
        $(this).find('.cell').each(function(){
            let cell = getdefaultcell();
            cells.push(cell);
           preparecelldiv(this, cell);
        })
        rows.push(cells);
    })
    $('#grid .cell:first').click();
    $('#home-menu').click();
})

$('#open').on('click', async function(){
    let dobj = await dialog.showOpenDialog();
    let data = await fsp.readFile(dobj.filePaths[0]);
    rows = JSON.parse(data); // exact meaning??

    let i = 0;

    $('#grid').find('.row').each(function(){
        let j = 0;
        $(this).find('.cell').each(function(){
            let cell = rows[i][j];
            preparecelldiv(this, cell); // here 'this' meaning???
            j++;
        })
        i++;
    })
    $('#grid .cell:first').click();
    $('#home-menu').click();

})

$('#save').on('click', async function(){
    let sobj = await dialog.showSaveDialog();
    let data = JSON.stringify(rows);
    await fsp.writeFile(sobj.filePath, data);
    alert('saved successfully');

    $('#home-menu').trigger('click');
  })

$("#menu-bar > div").on("click", function(){
    $("#menu-bar > div").removeClass('selected')
    $(this).addClass('selected');

    let menuContainerId = $(this).attr('data-content');
    $("#menu-content-container > div").css('display', 'none');
    $('#' + menuContainerId).css('display', 'flex');
})

$('#font-family').on('change', function(){
    let fontFamily = $(this).val();
    $('#grid .cell.selected').each(function(){
        $(this).css('font-family', fontFamily);
        let rid = parseInt($(this).attr('rid'));
        let cid = parseInt($(this).attr('cid'));
    
           let cobj = rows[rid][cid];
           cobj.fontFamily = fontFamily;
    })
})

$('#font-size').on('change', function(){
    let fontSize = $(this).val();
    $('#grid .cell.selected').each(function(){
        $(this).css('font-size', fontSize + 'px');
        let rid = parseInt($(this).attr('rid'));
        let cid = parseInt($(this).attr('cid'));
    
           let cobj = rows[rid][cid];
           cobj.fontSize = fontSize;
    })
})

$('#bold').on('click', function(){
        $(this).toggleClass('selected');
        let bold = $(this).hasClass('selected');
        $('#grid .cell.selected').each(function(){
            $(this).css('font-weight', bold? 'bold': 'normal');
            let rid = parseInt($(this).attr('rid'));
            let cid = parseInt($(this).attr('cid'));
        
               let cobj = rows[rid][cid];
               cobj.bold = bold;
        })
        

    })
   
    $('#italic').on('click', function(){
        $(this).toggleClass('selected');
        let italic = $(this).hasClass('selected');
        $('#grid .cell.selected').each(function(){
            $(this).css('font-style', italic? 'italic': 'normal');
            let rid = parseInt($(this).attr('rid'));
            let cid = parseInt($(this).attr('cid'));
        
               let cobj = rows[rid][cid];
               cobj.italic = italic;
        })
    })
    
    $('#underline').on('click', function(){
        $(this).toggleClass('selected');
        let underline = $(this).hasClass('selected');
        $('#grid .cell.selected').each(function(){
            $(this).css('text-decoration', underline? 'underline': 'none');
            let rid = parseInt($(this).attr('rid'));
            let cid = parseInt($(this).attr('cid'));
        
               let cobj = rows[rid][cid];
               cobj.underline = underline;
        })
        
    })

    $('#bg-color').on('change', function(){
      
        let bgcolor = $(this).val();
        $('#grid .cell.selected').each(function(){
            $(this).css('background-color', bgcolor);
            let rid = parseInt($(this).attr('rid'));
            let cid = parseInt($(this).attr('cid'));
        
               let cobj = rows[rid][cid];
               cobj.bgcolor = bgcolor;
        })
        
    })

    $('#text-color').on('change', function(){
      
        let textcolor = $(this).val();
        $('#grid .cell.selected').each(function(){
            $(this).css('color', textcolor);
            let rid = parseInt($(this).attr('rid'));
            let cid = parseInt($(this).attr('cid'));
        
               let cobj = rows[rid][cid];
               cobj.textcolor = textcolor;
        })
        
    })

    $('.valign').on('click', function(){
        $('.valign').removeClass('selected');
        $(this).addClass('selected');
    })
    
    $('.halign').on('click', function(){
        $('.halign').removeClass('selected');
        $(this).addClass('selected');

        let halign = $(this).attr('prop-val');
        $('#grid .cell.selected').each(function(){
            $(this).css('text-align', halign);
            let rid = parseInt($(this).attr('rid'));
            let cid = parseInt($(this).attr('cid'));
        
               let cobj = rows[rid][cid];
               cobj.halign = halign;
        })
    })

    $('#grid .cell').on('click', function (e) {
        lso = this;
       if(e.ctrlKey){
        $(this).addClass('selected');
       }
       else{

           $('#grid .cell').removeClass('selected');
           $(this).addClass('selected');
       }

       let rid = parseInt($(this).attr('rid'));
       let cid = parseInt($(this).attr('cid'));
       let cobj = rows[rid][cid];

       $('#font-family').val(cobj.fontFamily);
       $('#font-size').val(cobj.fontSize);

       if(cobj.bold){
        $('#bold').addClass('selected');
       }
       else{
        $('#bold').removeClass('selected');
       }
       if(cobj.italic){
        $('#italic').addClass('selected');
       }
       else{
        $('#italic').removeClass('selected');
       }

       if(cobj.underline){
        $('#underline').addClass('selected');
       }
       else{
        $('#underline').removeClass('selected');
       }

       $('#bg-color').val(cobj.bgcolor);
       $('#text-color').val(cobj.textcolor);
       $('.halign').removeClass('selected');
       $('.halign[prop-val=' + cobj.halign + ']').addClass('selected');

       $('#cellFormula').val(String.fromCharCode(cid + 65) + (rid + 1));
       $('#txtFormula').val(cobj.formula);
       
    })

    function evaluateFormula(cobj){
        let formula = cobj.formula;
        for(let i = 0; i < cobj.upstream.length; i++){
            let uso = cobj.upstream[i];
            let fuso = rows[uso.rid][uso.cid];
            let cellName = String.fromCharCode('A'.charCodeAt(0) + uso.cid) + (uso.rid + 1);
            formula = formula.replace(cellName, fuso.val || 0);
        }
        let nval = eval(formula);  //infix exp evaluiaton
        return nval;
    }

    function updateVal(rid, cid, val, render){
        let cobj = rows[rid][cid];
        cobj.val = val;
        if(render){
            $('.cell[rid=' + rid + '][cid=' + cid + ']').html(val);

        }

        for(let i = 0; i < cobj.downstream.length; i++){
            let dso = cobj.downstream[i];
            let fdso = rows[dso.rid][dso.cid];
            let nval = evaluateFormula(fdso);
            updateVal(dso.rid, dso.cid, nval, true);
        }
    }

    function deleteFormula(rid, cid){
        let cobj = rows[rid][cid];
        cobj.formula = '';

        for(let i = 0; i < cobj.upstream.length; i++){
                 let uso = cobj.upstream[i];
                  let fuso = rows[uso.rid][uso.cid];
            
                  for(let j = 0; j < fuso.dowmstream.length; j++){
                    let dso = fuso.downstream[j];
                      if(dso.rid == rid && dso.cid == cid){
                        fuso.downstream.splice(j,1);
                        break;
                            }
                        }
                    }

                    cobj.upstream = [];
    }

    function setupFormula(rid, cid, formula){
        let cobj = rows[rid][cid];
        cobj.formula = formula;

        //setup upstream downstream
        formula = formula.replace('(','').replace(')','');
        let comps = formula.split(' ');
        for(let i = 0; i < comps.length; i++){
            if(comps[i].charCodeAt(0) >= "A".charCodeAt(0) && comps[i].charCodeAt(0) <= "Z".charCodeAt(0)){
                let urid = parseInt(comps[i].substr(1)) - 1;
                let ucid = comps[i].charCodeAt(0) - "A".charCodeAt(0);
                cobj.upstream.push({
                    rid: urid,
                    cid: ucid
                })

                let fuso = rows[urid][ucid];
                fuso.downstream.push({
                    rid: rid,
                    cid: cid
                })
            }
        }

    }

    $('#grid .cell').on('keyup', function (e) {
       let rid = parseInt($(this).attr('rid'));
       let cid = parseInt($(this).attr('cid'));

       let cobj = rows[rid][cid];
       if(cobj.formula){
           $('#txtFormula').val('');
           deleteFormula(rid, cid);
       }

       updateVal(rid, cid, $(this).html(), false);
        
     })

     $('#txtFormula').on('blur', function(){
         let formula = $(this).val();
       
         $('#grid .cell.selected').each(function(){
            let rid = parseInt($(this).attr('rid'));
            let cid = parseInt($(this).attr('cid'));
            let cobj = rows[rid][cid];

            if(cobj.formula) {
                deleteFormula(rid, cid);
            }

            setupFormula(rid, cid, formula);
            let nval = evaluateFormula(cobj);
            updateVal(rid, cid, nval, true);
        });

     })
    
    $('#new').click();
})

  









// $('grid.cell').on('keyup', function(e){
//     let rid = parseInt($(this).attr('rid'));
//     let cid = parseInt($(this).attr('cid'));

//     let cobj = rows[rid][cid];
//     if(cobj.formula){
//         $('#txtFormula').val('');
//         cobj.formula = '';
//         // delete formula and update upstream

//         for(let i = 0; i < cobj.upstream.length; i++){
//             let uso = cobj.upstream[i];
//             let fuso = rows[uso.rid][uso.cid];

//             for(let j = 0; j < fuso.dowmstream.length; j++){
//                 let dso = fuso.downstream[j];
//                 if(dso.rid == rid && dso.cid == cid){
//                     fuso.downstream.splice(j,1);
//                     break;
//                 }
//             }
//         }
//         cobj.upstream = [];
//     }
//     cobj.val = $(this).html();
//     for(let i = 0; i < cobj.downstream.length; i++){
//         let dso = cobj.downstream[i];
//         updateVal(rid, cid, cobj.val, dso.rid, dso.cid);

//     }

// })

// $('#txtFormula').on('blur', function(){

// })
