import React, { useState } from 'react';

const AddDocumentTemplateByDnD = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [fieldSetting,setFieldSetting] = useState(null);

  const [inputMaster,setInputMaster] = useState("");
  const [properties,setProperties] = useState({
    htmlAttributePropertyName:"",
    displayLabel:"",
    htmlControlType:"",
    divideInColumns:"",
    minCharacters:"",
    maxCharacters:"",
    sequenceNumber:"",
    isRequired:false,
    isHeader:false,
    textOrPlaceholder:"",
    textHtml:"",
    htmlControlHasMasterData:false,
    htmlControlMasterData:null,
    hint:""
  });



  const handleDragStart = (e, field) => {
    e.dataTransfer.setData('text/plain', field.type);
    setSelectedField(field);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData('text');
    let prop = fields.filter(fld => fld.type===fieldType);
    const newField = { type: fieldType, id: Date.now(), properties:prop[0]?.properties };
    
    const fieldsCount = formFields.filter(item=>item.type===fieldType);

    newField.properties.htmlAttributePropertyName = fieldType + (fieldsCount.length > 0?fieldsCount.length:0);
    
    setFormFields([...formFields,newField]);
    
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteField = (id) => {
    const updatedFields = formFields.filter((field) => field.id !== id);
    setFormFields(updatedFields);
  };

  const fields = [
    { type: 'paragraph', label: 'Paragraph',properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:"",hint:""
    }  },
    { type: 'textBox', label: 'Text Box',properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:"",hint:""
    } },
    { type: 'TextArea', label: 'Text Area',properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:"",hint:""
    } },
    { type: 'radio', label: 'Radio Button',properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:true,
      htmlControlMasterData:null,
      hint:""
    } },
    { type: 'checkbox', label: 'Checkbox',properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",
      htmlControlHasMasterData:true,
      htmlControlMasterData:null,
      hint:""
    } },
    { type: 'dropDown', label: "Drop Down List",properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:true,
      htmlControlMasterData:null,
      hint:""
    }},
    { type: 'signLine', label: "Signature Line",properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:"",hint:""
    }},
    { type: 'datePicker', label: "Date Picker",properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:"",hint:""
    }},
    { type: 'timePicker', label: "Time Picker",properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:"",hint:""
    }},
    { type: 'textEditor', label: "Text Editor",properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:"",hint:""
    }},
    { type: 'heading3', label: "Heading",properties:{
      htmlAttributePropertyName:"",displayLabel:"",htmlControlType:"",divideInColumns:"",minCharacters:"",maxCharacters:"",sequenceNumber:"",isRequired:"",isHeader:"",textOrPlaceholder:"",textHtml:"",htmlControlHasMasterData:"",hint:""
    }},
    
  ];

  const handleFieldSetting = (id) =>{
    
    let prop = formFields.filter(fld => fld.id === id);

    const fieldsProp = {
      htmlAttributePropertyName:"",
      displayLabel:"",
      htmlControlType:"",
      divideInColumns:1,
      minCharacters:"",
      maxCharacters:"",
      sequenceNumber:"",
      isRequired:false,
      isHeader:false,
      textOrPlaceholder:"",
      textHtml:"",
      htmlControlHasMasterData:false,
      htmlControlMasterData:null,
      hint:""
    };
    const fieldsPropKeys = Object.keys(prop[0]?.properties);
    setFieldSetting({id:prop[0]?.id,values:fieldsPropKeys});
    
    fieldsPropKeys.map(item=>{
      if(prop[0]?.properties[item]){
        fieldsProp[item] = prop[0]?.properties[item]?prop[0]?.properties[item]:fieldsProp[item];
      }

      setProperties(fieldsProp);

      return fieldsProp;
    })
      
    
      
  }
const handleFieldsValue = (e)=>{
  
  const type = e.target.getAttribute('customtype');
  const id = e.target.getAttribute('customid');

  let updateFields = formFields.map((fld,index) => {
    
    if(fld.id === parseInt(id)){
      fld.properties[type] = type==="isRequired" ? e.target.checked : e.target.value;  
      setProperties(fld.properties);
    }
    
    return fld;
});

setFormFields(updateFields);

}

// const showFieldsInputValue = (type,id)=>{
//   let prop = formFields.filter(fld => fld.id === parseInt(id));
// return prop[0]?.properties[type]?prop[0]?.properties[type]:""  
// }

const addMasterItems = (type,id)=>{

  let updateFields = formFields.map((fld,index) => {
   
    if(fld.id === parseInt(id)){
      
      let items = fld.properties[type] ? fld.properties[type].map(item=>item?.keyValue) : []; 
      items.push(inputMaster);  
      fld.properties[type] = items.map((item,index)=>({keyIndex:index,keyValue:item}));
      
    }
    
    setInputMaster("");
    
    return fld;
});
  
setFormFields(updateFields);
}

const delSelectedItem = (type,id,keyValue)=>{
  
  let updateFields = formFields.map((fld,index) => {
   
    if(fld.id === parseInt(id)){
    
      let items = fld.properties[type] ? fld.properties[type].filter(item=>item.keyValue !== keyValue) : []; 
      fld.properties[type] = items;
      
    }
    
    setInputMaster("");
    return fld;
});
  
setFormFields(updateFields);
}
const showAddedMasterItems = (type,id)=>{
  let items = null;
formFields.map((fld) => {
    if(fld.id === parseInt(id)){
      items = fld.properties[type] && fld.properties[type].map(item=>((<li key={item.keyIndex}>{item.keyValue} <button onClick={()=>{ delSelectedItem(type,id,item.keyValue) }}>Del</button></li>)))
}

  return items && <ul style={{listStyle:"none", display:"flex",flexDirection:"column"}}>{items}</ul>;
});
return items
}
const showFieldsInput = (type,id)=>{

        if(type === "displayLabel"){

          return (<div style={{display:'flex',flexDirection:'column', margin:10}}>
            <label>Display Label</label>
            <input type='text' customid={id} customtype={type} onChange={handleFieldsValue} value={properties[type]} placeholder='Enter label' min={2} max={50}  />
          </div>)
        }

        if(type === "divideInColumns"){
          return (<div style={{display:'flex',flexDirection:'column', margin:10}}>
            <label>Columns</label>
            <input type='number' customid={id} customtype={type} onChange={handleFieldsValue} value={properties[type]} placeholder='Enter column' min={1} max={4} />
          </div>)
        }

        if(type === "minCharacters"){
          return (<div style={{display:'flex',flexDirection:'column', margin:10}}>
            <label>Minimum Characters</label>
            <input type='number' customid={id} customtype={type} onChange={handleFieldsValue} value={properties[type]} placeholder='Enter min characters' min={1} max={4} />
          </div>)
        }

        if(type === "isRequired"){
          return (<div style={{display:'flex',flexDirection:'row', margin:10}}>
            <input type='checkbox' customid={id} customtype={type} onChange={handleFieldsValue} checked={properties[type]} /> <label>isRequired</label>
            
          </div>)
        }

        if(type === "hint"){
          return (<div style={{display:'flex',flexDirection:'column', margin:10}}>
            <label>Hint</label>
            <input type='text' customid={id} customtype={type} onChange={handleFieldsValue} value={properties[type]} placeholder='Enter hint' required />
            
          </div>)
        }

        if(type === "textOrPlaceholder"){
          return (<div style={{display:'flex',flexDirection:'column', margin:10}}>
            <label>Text or Placeholder</label>
            <input type='text' customid={id} customtype={type} onChange={handleFieldsValue} value={properties[type]} placeholder='Enter text or placeholder' required />
            
          </div>)
        }

        if(type === "htmlControlMasterData"){
          return (<div style={{display:'flex',flexDirection:'column', margin:10}}>
            <label>Items</label>
            <input type='text' placeholder='Add Item'  id="masterItem" value={inputMaster} onChange={(e)=>setInputMaster(e.target.value)} />
            
              { showAddedMasterItems(type,id) }
            
            <button onClick={()=>addMasterItems(type,id)}>Add item</button>
          </div>)
        }

         return null;
}

const showProperties = (type,id)=>{
          
}

  return (
    <div className="Container">
      <div className="row" >
        <div className="fields-panel col-2" style={{border:"5px solid #ffffff",backgroundColor:"#f1f1f1"}}>
          <h2>Fields</h2>
          {fields.map((field) => (
            <div
              key={field.type}
              className="field"
              draggable
              onDragStart={(e) => handleDragStart(e, field)}

              style={{
                backgroundColor: "#635bff",
                color: "white",
                fontSize: "16px",
                padding: "5px 20px",
                borderRadius: "5px",
                margin: "5px 0px",
                cursor: "pointer"
              }}
            >
              {field.label}
            </div>
          ))}
        </div>
        <div
          className="form-preview col-6"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{border:"5px solid #ffffff",backgroundColor:"#f1f1f1"}}
        >
          <h2>Form <button onClick={()=>{}}>Preview</button></h2>
          
          {formFields.map((field) => (
            <div key={field.id} className="form-field" style={{
              backgroundColor: "#f1f1f1",
              color: "black",
              border:"1px",
              fontSize: "16px",
              padding: "5px 20px",
              borderRadius: "5px",
              margin: "5px 0px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",

            }}>
              
              <div style={{
                display: "flex",
                flexDirection: "column",flexGrow: 8}}>
              <label>{field.properties['displayLabel']?field.properties['displayLabel']:field.type}</label>
              {showProperties(field.type,field.id)}
              </div>
              <div>
              <button onClick={() => handleDeleteField(field.id)}>X</button>
              <button onClick={() => handleFieldSetting(field.id)}>Edit</button>
              </div>
            </div>
          ))}
        </div>

        <div className="form-config col-2" style={{border:"5px solid #ffffff",backgroundColor:"#f1f1f1"}}>
        <h2>Fields Setting</h2>
        { (formFields?.length && fieldSetting?.values?.length) && fieldSetting?.values.map((fs,index)=>(
          <div key={index}>
            {showFieldsInput(fs,fieldSetting?.id)}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default AddDocumentTemplateByDnD;