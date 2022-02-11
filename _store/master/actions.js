//Plugins
import config from '@imagina/qsite/_config/master/index'
import crud from "@imagina/qcrud/_services/baseService"
import cloneDeep from 'lodash.clonedeep'

//Get site settings
export const GET_TRANSLATIONS = ({commit, dispatch, state, getters, rootGetters}, payload = {}) => {
  return new Promise((resolve, reject) => {
    //Instance response
    let translations = {en: {}, es: {}}
    rootGetters['qsiteApp/getSelectedLocalesSelect'].forEach(item => {
      translations[item.value] = {}
    })

    //Request Params
    let requestParams = {
      refresh: true,
      params: {filter: {search: '::cms'}, take: 5}
    }

    //Request
    crud.index('apiRoutes.qtranslation.translations', requestParams).then(async response => {
      //Map translations
      response.data.forEach((item) => {
        //Get module name
        let moduleName = item.key.split('::')[0]
        //Add the letter "q" at the beginning, if the moduleName has a letter "i" at the beginning it will be removed
        moduleName = 'q' + (moduleName.charAt(0) == "i" ? moduleName.substring(1) : moduleName)
        //Replace "cms" with "layout" from string and it splits
        let structureNames = item.key.split('::')[1].replace('cms', 'layout').split('.')

        //Add translations by language
        Object.keys(translations).forEach(lang => {
          //Recursive: Add structure names to translations
          var setValue = (tree, obj, value) => {
            if (tree.length) {
              //Create the key in the object if it doesn't exist
              let currentKey = tree[0]
              if (!obj[currentKey]) obj[currentKey] = {}

              //If there is more than 1 key, go to the next level
              if (tree.length >= 2) {
                tree.shift()
                obj[currentKey] = setValue(tree, obj[currentKey], value)
              }
              //Set value to key of obj
              else obj[currentKey] = value
            }
            //Return obj
            return obj
          }

          //Add translation by lang and moduleName
          translations[lang][moduleName] = setValue(
            cloneDeep(structureNames),//Duplicate of structure names
            (translations[lang][moduleName] || {}), //Current translations by lang and current moduleName
            cloneDeep((item[lang] && item[lang].value) ? item[lang].value : item.value)//Value by lang or default value
          )
        })
      });
      resolve(translations)
    }).catch(error => {
      console.error('[store-qtranslations]Error:: Store getting site translations - ', error)
      resolve(translations)
    })
  })
}
