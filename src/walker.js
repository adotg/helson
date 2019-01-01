const Word = require("./parse-tree").Word;

const walkList = (nodes, parent, args) => {
  let i = 0;
  let l = nodes.length;

  // An regular forEach loop won't do as during transformation the child of an node could be mutated to add more child.
  // This keeps the assumption of depth first traversal. Hence if the new child is added before already traversed node
  // then it's an implementation issue.
  while (i < l) {
    walkNode(nodes[i], parent, args);

    i++;
    // Recheck the length of the node
    l = nodes.length;
  }
};

const walkNode = (node, parent, args) => {
  const { nodeType } = node;
  const { visitor } = args;
  const methods = visitor[nodeType];

  if (methods && methods.enter) {
    methods.enter(node, parent, args.root);
  }

  switch (nodeType) {
    case Word.Program:
    case Word.StructureDefinition:
    case Word.StructureBody:
    case Word.StructureIdentifier:
    case Word.PairDefinition:
      walkList(node.children, node, args);
      break;

    default:
      break;
  }

  if (methods && methods.exit) {
    methods.exit(node, parent);
  }
};

function walker(parseTree, visitor, hooks) {
  walkNode(parseTree, null, { visitor, root: parseTree });

  hooks = hooks || {};
  hooks.walkComplete && hooks.walkComplete();
}

module.exports = walker;
