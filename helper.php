<?php
class statusesHelper extends Helper {

	public function buildRelation($relations){
		foreach($relations as $table => $records){
			if(!empty($records) && (isset($records[array_key_first($records)]['status']) || isset($records[array_key_first($records)]['statuses']))){
				foreach($records as $id => $record){
					if(isset($record['statuses'])){
						$relations[$table][$id]['statuses'] = $this->Auth->query('SELECT * FROM `statuses` WHERE `id` = ?',$record['statuses'])->fetchAll()->All()[0]['order'];
					}
					if(isset($record['status'])){
						$relations[$table][$id]['status'] = $this->Auth->query('SELECT * FROM `statuses` WHERE `relationship` = ? AND `order` = ?',$table,$record['status'])->fetchAll()->All()[0];
					}
				}
			}
		}
    return $relations;
  }
}
