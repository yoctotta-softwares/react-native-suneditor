import React, { useRef } from 'react';
import type { SunEditorReactProps } from 'suneditor-react/dist/types/SunEditorReactProps';
import { WebView } from 'react-native-webview';
import { useWindowDimensions } from 'react-native';

export function SunEditor(params: SunEditorReactProps) {
  const { width, height } = useWindowDimensions();
  const _webview = useRef<any>(null);

  const onMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'onImageUploadBefore') {
      if (params.onImageUploadBefore) {
        params.onImageUploadBefore(
          data.data[0],
          data.data[1],
          (result: any) => {
            _webview.current.injectJavaScript(
              `
                if(_uploadHandler) {
                    _uploadHandler(${JSON.stringify(result)});
                    _uploadHandler = null;
                }`
            );
          }
        );
      } else {
        _webview.current.injectJavaScript(
          `
            if(_uploadHandler) {
                _uploadHandler(${JSON.stringify({ result: data.data[0] })});
                _uploadHandler = null;
            }`
        );
      }
    } else if (data.type === 'onVideoUploadBefore') {
      if (params.onVideoUploadBefore) {
        params.onVideoUploadBefore(
          data.data[0],
          data.data[1],
          (result: any) => {
            _webview.current.injectJavaScript(
              `
                    if(_uploadHandler) {
                        _uploadHandler(${JSON.stringify(result)});
                        _uploadHandler = null;
                    }`
            );
          }
        );
      } else {
        _webview.current.injectJavaScript(
          `
                if(_uploadHandler) {
                    _uploadHandler(${JSON.stringify({ result: data.data[0] })});
                    _uploadHandler = null;
                }`
        );
      }
    } else if ((params as any)[data.type] != null) {
      (params as any)[data.type](data.data);
    }
  };

  return (
    <WebView
      ref={_webview}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width,
        height: height,
        backgroundColor: 'red',
      }}
      allowsFullscreenVideo
      onMessage={onMessage}
      allowFileAccess={true}
      domStorageEnabled={false}
      automaticallyAdjustContentInsets={true}
      bounces={false}
      dataDetectorTypes="none"
      scalesPageToFit={false}
      source={{
        html: `
        <html>
            <head>
                <link href="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css" rel="stylesheet">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css">
                <script src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/suneditor.min.js"></script>
            </head>
            <body>
                <textarea id="sample" style="width: ${width}px; min-height: ${height}px"></textarea>
            </body>
            <script>
                try{
                    const editor = SUNEDITOR.create((document.getElementById('sample') || 'sample'),{
                        // All of the plugins are loaded in the "window.SUNEDITOR" object in dist/suneditor.min.js file
                        // Insert options
                        // Language global object (default: en)
                        // lang: SUNEDITOR_LANG['ko'],
                        width: ${width - 20},
                        height: ${height},
                        // plugins: plugins,
                        buttonList: [
                            ['undo', 'redo'],
                            ['font', 'fontSize', 'formatBlock'],
                            ['paragraphStyle', 'blockquote'],
                            [
                                'bold',
                                'underline',
                                'italic',
                                'strike',
                                'subscript',
                                'superscript',
                                // 'math',
                            ],
                            ['fontColor', 'hiliteColor', 'textStyle'],
                            ['removeFormat'],
                            ['outdent', 'indent'],
                            ['align', 'horizontalRule', 'list', 'lineHeight'],
                            ['table', 'link', 'image', 'video'],
                            [ 'codeView'],
                            ['template'],
                            ['fullScreen', 'showBlocks', 'codeView'],
                        ],
                        
                    });

                    editor.onChange = (data) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data, type: 'onChange'}))}}

                    const toBase64 = file => new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                    });

                    editor.onload = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args[1], type: 'onload'}))}}
                    editor.onScroll = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args[0], type: 'onScroll'}))}}
                    editor.onMouseDown = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args[0], type: 'onMouseDown'}))}}
                    editor.onClick = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args[0], type: 'onClick'}))}}
                    editor.onInput = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args[0], type: 'onInput'}))}}
                    editor.onKeyDown = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args[0], type: 'onKeyDown'}))}}
                    editor.onKeyUp = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args[0], type: 'onKeyUp'}))}}
                    editor.onDrop = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: [args[0],args[1],args[2]], type: 'onDrop'}))}}
                    editor.onFocus = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args[0], type: 'onFocus'}))}}
                    editor.onBlur = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args[0], type: 'onBlur'}))}}
                    editor.onPaste = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: [args[0],args[1],args[2]], type: 'onPaste'}))}}
                    editor.onCopy = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: [args[0],args[1] ], type: 'onCopy'}))}}
                    editor.onCut = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: [args[0],args[1]], type: 'onCut'}))}}
                    editor.onImageUploadBefore = (...args) => {
                        if(window.ReactNativeWebView) {
                            Promise.all(args[0].map(async x => ({url:await toBase64(x), name: x.name, type:x.type, size:x.size})))
                                .then(x => {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({data: [x, args[1]], type: 'onImageUploadBefore'}));
                                    // args[3]({
                                    //     result: x
                                    // })
                                    _uploadHandler = args[3];
                                })
                                
                            }
                        }
                    editor.onImageUpload = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: [args[0],args[1],args[2],args[3],args[4]], type: 'onImageUpload'}))}}
                    editor.onImageUploadError = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: [args[0],args[1]], type: 'onImageUploadError'}))}}
                    editor.onVideoUploadBefore = (...args) => {
                        if(window.ReactNativeWebView) {
                            Promise.all(args[0].map(async x => ({url:await toBase64(x), name: x.name, type:x.type, size:x.size})))
                                .then(x => {
                                    window.ReactNativeWebView.postMessage(JSON.stringify({data: [x, args[1]], type: 'onVideoUploadBefore'}));
                                    _uploadHandler = args[2];
                                })
                                
                            }
                        }
                    // editor.onVideoUpload = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args, type: 'onVideoUpload'}))}}
                    // editor.onVideoUploadError = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args, type: 'onVideoUploadError'}))}}
                    // editor.videoUploadHandler = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args, type: 'videoUploadHandler'}))}}
                    // editor.onAudioUploadBefore = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args, type: 'onAudioUploadBefore'}))}}
                    // editor.onAudioUpload = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args, type: 'onAudioUpload'}))}}
                    // editor.onAudioUploadError = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args, type: 'onAudioUploadError'}))}}
                    // editor.onResizeEditor = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args, type: 'onResizeEditor'}))}}
                    // editor.onSetToolbarButtons = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args, type: 'onSetToolbarButtons'}))}}
                    // editor.audioUploadHandler = (...args) => {if(window.ReactNativeWebView) {window.ReactNativeWebView.postMessage(JSON.stringify({data: args, type: 'audioUploadHandler'}))}}
                } catch(e) {
                    alert(e);
                }
            </script>
        </html>
        `,
      }}
    />
  );
}
