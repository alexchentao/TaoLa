using System;

namespace Himall.Model
{
	public class WXJSCardExtModel
	{
		public string timestamp
		{
			get;
			set;
		}

		public string signature
		{
			get;
			set;
		}

		public string nonce_str
		{
			get;
			set;
		}

		public int outer_id
		{
			get;
			set;
		}
	}
}
