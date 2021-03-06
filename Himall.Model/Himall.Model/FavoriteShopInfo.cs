using System;

namespace Himall.Model
{
	public class FavoriteShopInfo : BaseModel
	{
		private long _id;

		public new long Id
		{
			get
			{
				return this._id;
			}
			set
			{
				this._id = value;
				base.Id = value;
			}
		}

		public long UserId
		{
			get;
			set;
		}

		public long ShopId
		{
			get;
			set;
		}

		public string Tags
		{
			get;
			set;
		}

		public DateTime Date
		{
			get;
			set;
		}

		public virtual UserMemberInfo MemberInfo
		{
			get;
			set;
		}

		public virtual ShopInfo Himall_Shops
		{
			get;
			set;
		}
	}
}
