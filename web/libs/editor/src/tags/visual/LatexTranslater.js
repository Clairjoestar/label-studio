import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { types } from 'mobx-state-tree';
import Registry from '../../core/Registry';
import ProcessAttrsMixin from '../../mixins/ProcessAttrs';
import { guidGenerator } from '../../utils/unique';
import 'katex/dist/katex.min.css';
import katex from 'katex'
import { render } from 'react-dom';
/**

 * @name LatexTranslater
 * @param {string} name                       - Name of the element
 * @param {string} value                     - Data reference
*/

const Model = types.model({
  id: types.optional(types.identifier, guidGenerator),
  type: 'latextranslater',
  value: types.optional(types.string, "$"),
});

const LatexTranslaterModel = types.compose(
  'LatexTranslaterModel',
  ProcessAttrsMixin,
  Model,
);

const HtxLatexTranslater = observer(({ item }) => {
  const [text, setText] = useState("");
  const rendered = useMemo(() => katex.renderToString(text, {
    displayMode: true,
    output: "html",
    throwOnError: false
  }), [text]);
  const cb = (mutLst) => {
    for (const mut of mutLst) {
      if (mut.target.name == item.value) {
        const str = mut.target.value;
        // console.log(str);
        setText(str);
      }
    }
  };
  useEffect(() => {
    const obs = new MutationObserver(cb);
    obs.observe(document.querySelector("html"), { attributes: true, subtree: true, attributeFilter: ["value"], });
    // console.log("Observed", obs);
    return () => obs.disconnect();
  });

  return (
    <div dangerouslySetInnerHTML={{ __html: rendered }} />
  )
})
Registry.addTag('latextranslater', LatexTranslaterModel, HtxLatexTranslater);
export { HtxLatexTranslater, LatexTranslaterModel }
// todo 