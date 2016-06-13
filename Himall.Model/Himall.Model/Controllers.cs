using System;
using System.Collections.Generic;

namespace Himall.Model
{
	public class Controllers
	{
		public string ControllerName
		{
			get;
			set;
		}

		public List<string> ActionNames
		{
			get;
			set;
		}

		public Controllers()
		{
			this.ActionNames = new List<string>();
		}
	}
}
