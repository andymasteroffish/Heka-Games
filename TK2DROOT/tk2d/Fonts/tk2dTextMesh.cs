using UnityEngine;
using System.Collections;

[ExecuteInEditMode]
[RequireComponent(typeof(MeshFilter))]
[RequireComponent(typeof(MeshRenderer))]
[AddComponentMenu("2D Toolkit/tk2dTextMesh")]
public class tk2dTextMesh : MonoBehaviour 
{
	[SerializeField] tk2dFontData _font;
    [SerializeField] string _text = ""; 
    [SerializeField] Color _color = Color.white; 
    [SerializeField] Color _color2 = Color.white; 
    [SerializeField] bool _useGradient = false; 
	[SerializeField] int _textureGradient = 0;
    [SerializeField] TextAnchor _anchor = TextAnchor.LowerLeft; 
    [SerializeField] Vector3 _scale = new Vector3(1.0f, 1.0f, 1.0f); 
	[SerializeField] bool _kerning = false; 
    [SerializeField] int _maxChars = 16; 
	[SerializeField] bool _inlineStyling = false;
	public bool pixelPerfect = false;
	public float spacing = 0.0f;
	
    Vector3[] vertices;
    Vector2[] uvs;
	Vector2[] uv2;
    Color[] colors;
	
	[System.FlagsAttribute]
	enum UpdateFlags
	{
		UpdateNone		= 0,
		UpdateText		= 1,	// update text vertices & uvs
		UpdateColors	= 2,	// only colors have changed
		UpdateBuffers	= 4,	// update buffers (maxchars has changed)
	};
	UpdateFlags updateFlags = UpdateFlags.UpdateBuffers;

    Mesh mesh;
	MeshFilter meshFilter;

	// accessors
	public tk2dFontData font { get { return _font ; } set { _font = value; updateFlags |= UpdateFlags.UpdateText; } }
	public string text { get { return _text; } set { _text = value;  updateFlags |= UpdateFlags.UpdateText; } }
	public Color color { get { return _color; } set { _color = value; updateFlags |= UpdateFlags.UpdateColors; } }
	public Color color2 { get { return _color2; } set { _color2 = value; updateFlags |= UpdateFlags.UpdateColors; } }
	public bool useGradient { get { return _useGradient; } set { _useGradient = value; updateFlags |= UpdateFlags.UpdateColors; } }
	public TextAnchor anchor { get { return _anchor; } set { _anchor = value; updateFlags |= UpdateFlags.UpdateText; } }
	public Vector3 scale { get { return _scale; } set { _scale = value; updateFlags |= UpdateFlags.UpdateText; } }
	public bool kerning { get { return _kerning; } set { _kerning = value; updateFlags |= UpdateFlags.UpdateText; } }
	public int maxChars { get { return _maxChars; } set { _maxChars = value; updateFlags |= UpdateFlags.UpdateBuffers; } }
	public int textureGradient { get { return _textureGradient; } set { _textureGradient = value % font.gradientCount; updateFlags |= UpdateFlags.UpdateText; } }
	public bool inlineStyling { get { return _inlineStyling; } set { _inlineStyling = value; updateFlags |= tk2dTextMesh.UpdateFlags.UpdateText; } }
	
	// Use this for initialization
	void Awake() 
	{
		if (pixelPerfect)
			MakePixelPerfect();
		
		meshFilter = GetComponent<MeshFilter>();
		mesh = new Mesh();
		meshFilter.mesh = mesh;
		
        Init();
	}
	
	bool useInlineStyling { get { return inlineStyling && _font.textureGradients; } }
	
	public int NumDrawnCharacters()
	{
		bool _useInlineStyling = useInlineStyling;
		int charsDrawn = 0;
		for (int i = 0; i < _text.Length && charsDrawn < _maxChars; ++i)
		{
            int idx = _text[i];
            if (idx >= _font.chars.Length) idx = 0; // should be space

			if (idx == '\n')
			{
				continue;
			}
			else if (_useInlineStyling)
			{
				if (idx == '^')
				{
					if (i+1 < _text.Length)
					{
						i++;
						if (_text[i] != '^')
						{
							continue;
						}
					}
				}
			}
			
			++charsDrawn;
		}
		return charsDrawn;
	}
	
	void PostAlignTextData(int targetStart, int targetEnd, float offsetX)
	{
		for (int i = targetStart * 4; i < targetEnd * 4; ++i)
		{
			Vector3 v = vertices[i];
			v.x += offsetX;
			vertices[i] = v;
		}
	}
	
	int FillTextData()
	{
		Vector2 gradientOffset = new Vector2((float)_textureGradient / font.gradientCount, 0);
		
		Vector2 dims = GetMeshDimensionsForString(_text);
		float offsetY = GetYAnchorForHeight(dims.y);
		
		bool _useInlineStyling = useInlineStyling;
        float cursorX = 0.0f;
		float cursorY = 0.0f;
		int target = 0;
		int alignStartTarget = 0;
		for (int i = 0; i < _text.Length && target < _maxChars; ++i)
		{
            int idx = _text[i];
            if (idx >= _font.chars.Length) idx = 0; // should be space
            tk2dFontChar chr = _font.chars[idx];

			if (idx == '\n')
			{
				float lineWidth = cursorX;
				int alignEndTarget = target; // this is one after the last filled character
				if (alignStartTarget != target)
				{
					float xOffset = GetXAnchorForWidth(lineWidth);
					PostAlignTextData(alignStartTarget, alignEndTarget, xOffset);
				}
				
				
				alignStartTarget = target;
				cursorX = 0.0f;
				cursorY -= _font.lineHeight * _scale.y;
				continue;
			}
			else if (_useInlineStyling)
			{
				if (idx == '^')
				{
					if (i+1 < _text.Length)
					{
						i++;
						if (_text[i] != '^')
						{
							int data = _text[i] - '0';
							gradientOffset = new Vector2((float)data / font.gradientCount, 0);
							continue;
						}
					}
				}
			}
			
            vertices[target * 4 + 0] = new Vector3(cursorX + chr.p0.x * _scale.x, offsetY + cursorY + chr.p0.y * _scale.y, 0);
            vertices[target * 4 + 1] = new Vector3(cursorX + chr.p1.x * _scale.x, offsetY + cursorY + chr.p0.y * _scale.y, 0);
            vertices[target * 4 + 2] = new Vector3(cursorX + chr.p0.x * _scale.x, offsetY + cursorY + chr.p1.y * _scale.y, 0);
            vertices[target * 4 + 3] = new Vector3(cursorX + chr.p1.x * _scale.x, offsetY + cursorY + chr.p1.y * _scale.y, 0);

            uvs[target * 4 + 0] = new Vector2(chr.uv0.x, chr.uv0.y);
            uvs[target * 4 + 1] = new Vector2(chr.uv1.x, chr.uv0.y);
            uvs[target * 4 + 2] = new Vector2(chr.uv0.x, chr.uv1.y);
            uvs[target * 4 + 3] = new Vector2(chr.uv1.x, chr.uv1.y);
			
			if (_font.textureGradients)
			{
				uv2[target * 4 + 0] = gradientOffset + chr.gradientUv[0];
				uv2[target * 4 + 1] = gradientOffset + chr.gradientUv[1];
				uv2[target * 4 + 2] = gradientOffset + chr.gradientUv[2];
				uv2[target * 4 + 3] = gradientOffset + chr.gradientUv[3];
			}

            cursorX += (chr.advance + spacing) * _scale.x;
			
			if (_kerning && i < _text.Length - 1)
			{
				foreach (var k in _font.kerning)
				{
					if (k.c0 == _text[i] && k.c1 == _text[i+1])
					{
						cursorX += k.amount * _scale.x;
						break;
					}
				}
			}				
			
			++target;
		}
		
		if (alignStartTarget != target)
		{
			float lineWidth = cursorX;
			int alignEndTarget = target;
			float xOffset = GetXAnchorForWidth(lineWidth);
			PostAlignTextData(alignStartTarget, alignEndTarget, xOffset);
		}
		
		return target;		
	}
	
	public void Init(bool force)
	{
		if (force)
		{
			updateFlags |= UpdateFlags.UpdateBuffers;
		}
		Init();
	}
	
	public void Init()
    {
        if (_font && (updateFlags & UpdateFlags.UpdateBuffers) != 0)
        {
            Color topColor = _color;
            Color bottomColor = _useGradient?_color2:_color;

            // volatile data
            vertices = new Vector3[_maxChars * 4];
            uvs = new Vector2[_maxChars * 4];
            colors = new Color[_maxChars * 4];
			if (_font.textureGradients)
			{
				uv2 = new Vector2[_maxChars * 4];
			}
            int[] triangles = new int[_maxChars * 6];
			int target = FillTextData();
			
			for (int i = 0; i < target; ++i)
			{
                colors[i * 4 + 0] = colors[i * 4 + 1] = topColor;
                colors[i * 4 + 2] = colors[i * 4 + 3] = bottomColor;

                triangles[i * 6 + 0] = i * 4 + 0;
                triangles[i * 6 + 1] = i * 4 + 1;
                triangles[i * 6 + 2] = i * 4 + 3;
                triangles[i * 6 + 3] = i * 4 + 2;
                triangles[i * 6 + 4] = i * 4 + 0;
                triangles[i * 6 + 5] = i * 4 + 3;
			}
			
			for (int i = target; i < _maxChars; ++i)
			{
                vertices[i * 4 + 0] = vertices[i * 4 + 1] = vertices[i * 4 + 2] = vertices[i * 4 + 3] = Vector3.zero;
                uvs[i * 4 + 0] = uvs[i * 4 + 1] = uvs[i * 4 + 2] = uvs[i * 4 + 3] = Vector2.zero;
				if (_font.textureGradients) 
				{
                    uv2[i * 4 + 0] = uv2[i * 4 + 1] = uv2[i * 4 + 2] = uv2[i * 4 + 3] = Vector2.zero;
				}				

				colors[i * 4 + 0] = colors[i * 4 + 1] = topColor;
                colors[i * 4 + 2] = colors[i * 4 + 3] = bottomColor;

                triangles[i * 6 + 0] = i * 4 + 0;
                triangles[i * 6 + 1] = i * 4 + 1;
                triangles[i * 6 + 2] = i * 4 + 3;
                triangles[i * 6 + 3] = i * 4 + 2;
                triangles[i * 6 + 4] = i * 4 + 0;
                triangles[i * 6 + 5] = i * 4 + 3;
			}
			
			if (mesh != null)
			{
				mesh.Clear();
				
	            mesh.vertices = vertices;
	            mesh.uv = uvs;
				if (font.textureGradients)
				{
					mesh.uv1 = uv2;
				}
	            mesh.triangles = triangles;
	            mesh.colors = colors;
				mesh.RecalculateBounds();
			}
   
			updateFlags = UpdateFlags.UpdateNone;
    	}
    }
	
    public void Commit()
    {
		// Can come in here without anything initalized when
		// instantiated in code
		if ((updateFlags & UpdateFlags.UpdateBuffers) != 0)
		{
			Init();
		}
        else 
		{
			if ((updateFlags & UpdateFlags.UpdateText) != 0)
	        {
				int target = FillTextData();
				for (int i = target; i < _maxChars; ++i)
				{
					// was/is unnecessary to fill anything else
                    vertices[i * 4 + 0] = vertices[i * 4 + 1] = vertices[i * 4 + 2] = vertices[i * 4 + 3] = Vector3.zero;
	            }
	
	            mesh.vertices = vertices;
	            mesh.uv = uvs;
				if (font.textureGradients)
				{
					mesh.uv1 = uv2;
				}
				
				// comment this in for game if it becomes a problem
	#if UNITY_EDITOR
				mesh.RecalculateBounds();
	#endif
	        }
	
	        if ((updateFlags & UpdateFlags.UpdateColors) != 0)
	        {
	            Color topColor = _color;
	            Color bottomColor = _useGradient ? _color2 : _color;
	
	            for (int i = 0; i < colors.Length; i += 4)
	            {
	                colors[i + 0] = colors[i + 1] = topColor;
	                colors[i + 2] = colors[i + 3] = bottomColor;
	            }
	            mesh.colors = colors;
	        }
		}
		
		updateFlags = UpdateFlags.UpdateNone;
    }
	
	Vector2 GetMeshDimensionsForString(string str)
	{
		bool _useInlineStyling = useInlineStyling;
		float maxWidth = 0.0f;
		
        float cursorX = 0.0f;
		float cursorY = 0.0f;
		
		int target = 0;
		for (int i = 0; i < _text.Length && target < _maxChars; ++i)
		{
            int idx = _text[i];
            if (idx >= _font.chars.Length) idx = 0; // should be space
            tk2dFontChar chr = _font.chars[idx];

			if (idx == '\n')
			{
				maxWidth = Mathf.Max(cursorX, maxWidth);
				cursorX = 0.0f;
				cursorY -= _font.lineHeight * _scale.y;
				continue;
			}
			else if (_useInlineStyling)
			{
				if (idx == '^')
				{
					if (i+1 < _text.Length)
					{
						i++;
						if (_text[i] != '^')
						{
							continue;
						}
					}
				}
			}

            cursorX += (chr.advance + spacing) * _scale.x;
			if (_kerning && i < _text.Length - 1)
			{
				foreach (var k in _font.kerning)
				{
					if (k.c0 == _text[i] && k.c1 == _text[i+1])
					{
						cursorX += k.amount * _scale.x;
						break;
					}
				}
			}				
			
			++target;
		}
		
		maxWidth = Mathf.Max(cursorX, maxWidth);
		cursorY -= _font.lineHeight * _scale.y;
		
		return new Vector2(maxWidth, cursorY);
	}
	
	float GetYAnchorForHeight(float textHeight)
	{
		int heightAnchor = (int)_anchor / 3;
		float lineHeight = _font.lineHeight * _scale.y;
		switch (heightAnchor)
		{
            case 0: return -lineHeight;
            case 1: return -textHeight / 2.0f - lineHeight;
            case 2: return -textHeight - lineHeight;
		}
		return -lineHeight;
	}
	
	float GetXAnchorForWidth(float lineWidth)
	{
		int widthAnchor = (int)_anchor % 3;
		switch (widthAnchor)
		{
		case 0: return 0.0f; // left
		case 1: return -lineWidth / 2.0f; // center
		case 2: return -lineWidth; // right
		}
		return 0.0f;
	}

	public void MakePixelPerfect()
	{
		float s = 1.0f;
		tk2dPixelPerfectHelper pph = tk2dPixelPerfectHelper.inst;
		if (pph)
		{
			if (pph.CameraIsOrtho)
			{
				s = pph.scaleK;
			}
			else
			{
				s = pph.scaleK + pph.scaleD * transform.position.z;
			}
		}
		else if (Camera.main)
		{
			if (Camera.main.isOrthoGraphic)
			{
				s = Camera.main.orthographicSize;
			}
			else
			{
				float zdist = (transform.position.z - Camera.main.transform.position.z);
				s = tk2dPixelPerfectHelper.CalculateScaleForPerspectiveCamera(Camera.main.fov, zdist);
			}
		}
		scale = new Vector3(Mathf.Sign(scale.x) * s, Mathf.Sign(scale.y) * s, Mathf.Sign(scale.z) * s);
	}	
}
