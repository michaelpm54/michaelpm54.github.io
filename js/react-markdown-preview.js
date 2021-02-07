class MarkdownPreview extends React.Component
{
  constructor(props)
  {
    super(props);

    const defaultMarkdown = 
    "# Markdown preview using Marked and React!\n\n" +
    "## Sub-heading\n\n" +
    "[A link](#that-goes-nowhere)\n\n" +
    "`<div>Some inline code</div>`\n\n" +
    "``` js\nfunction codeBlock()\n{\n\tconsole.log(\"Hello!\");\n}\n```\n\n" +
    "* A list item\n\n" +
    "> A block quote\n\n" +
    "![An image](https://picsum.photos/seed/picsum/200/299)\n\n" +
    "**Some bold text**\n\n"
    ;
    
    this.state = {
       inputRaw: defaultMarkdown,
       inputHtml: '',
    };
    
    this.editorChanged = this.editorChanged.bind(this);
    this.updatePreview = this.updatePreview.bind(this);
  }
  
  componentDidMount()
  {
    this.updatePreview(this.state.inputRaw);
  }
  
  editorChanged(ev)
  {
    this.setState({
      inputRaw: ev.target.value,
    });
    this.updatePreview(ev.target.value);
  }
  
  updatePreview(value)
  {
    this.setState({
      inputHtml: marked(value, {breaks: true, gfm: true}),
    });
  }
  
  render()
  {
    return (
      <div>
        <textarea value={this.state.inputRaw} id="editor" onChange={this.editorChanged}>
        </textarea>
      
        <div id="preview" dangerouslySetInnerHTML={{__html: this.state.inputHtml}}>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MarkdownPreview />, document.getElementById("root"));